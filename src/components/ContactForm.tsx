import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "@/lib/emailjs";

const services = [
  { id: "graphic_design", label: "Graphic Design" },
  { id: "ad_creatives", label: "Ad Creatives" },
  { id: "meta_advertising", label: "Meta Advertising" },
  { id: "email_sms_marketing", label: "Email & SMS Marketing" },
  { id: "google_advertising", label: "Google Advertising" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "web_design", label: "Web Design" },
  { id: "shipping_fulfillment", label: "Shipping Fulfillment" },
  { id: "general_consultation", label: "General Consultation" },
] as const;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  budget: z.string().refine((val) => !val.includes("-") && Number(val) >= 0, {
    message: "Please enter a valid positive number.",
  }),
  revenue: z.string().refine((val) => !val.includes("-") && Number(val) >= 0, {
    message: "Please enter a valid positive number.",
  }),
  services: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one service.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      budget: "",
      revenue: "",
      services: [],
      message: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // The actual services value is now updated in the hidden input via React state/render flow implicitly
    // However, emailjs.sendForm reads from the DOM form element.
    // We need to ensure the "service" hidden input is populated with the comma-separated string.
    
    if (formRef.current) {
      emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        formRef.current,
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      .then((result) => {
          console.log('EmailJS Success:', result.text);
          setSubmitStatus("success");
          form.reset();
      }, (error) => {
          console.log('EmailJS Error:', error.text);
          setSubmitStatus("error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    }
  }

  // Helper to get current services as comma-separated string for the hidden input
  const currentServices = form.watch("services");
  const servicesString = services
    .filter(s => currentServices.includes(s.id))
    .map(s => s.label)
    .join(", ");

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Book A Meeting</h2>
        
        {/* Hidden input for stringified services */}
        <input type="hidden" name="service" value={servicesString} />
        {/* Mapping other fields to EmailJS template variable names */}
        {/* Note: React Hook Form manages inputs via 'name' prop, but EmailJS looks for 'name' attribute on DOM elements. */}
        {/* The <Input> and <Textarea> components pass {...field} which includes 'name', so we are good. */}
        {/* We just need to make sure the 'name' passed to the component matches what EmailJS expects OR we alias it. */}
        {/* Requirement says: {{name}} -> user_name, {{email}} -> user_email, etc. */}
        {/* So we should update the 'name' prop on the Input to match EmailJS variable if possible, OR use the hidden input strategy for all if the schema names differ. */}
        {/* Actually, requirement 4 says: {{name}} -> user_name input. This implies the EmailJS template expects 'name', 'email' etc variables, mapped FROM the form inputs 'user_name', 'user_email'. */}
        {/* Wait, "The form should send these fields to EmailJS variables: {{name}} -> user_name input" usually means the EmailJS template has {{name}} and the form input has name="user_name". */}
        {/* Let's strictly follow: "Connect the existing Booking Modal... {{name}} -> user_name input". */}
        {/* So I will override the name attribute on the input to match what EmailJS likely expects based on the prompt's mapping instructions, or better yet, I will keep the schema names but add hidden inputs if I can't change the controlled input name easily without breaking RHF. */}
        {/* Actually, standard RHF usage: name in schema matches name in input. */}
        {/* Prompt mapping: {{name}} -> user_name input. This likely means the input in the DOM should have name="user_name". */}
        {/* I will update the RHF schema keys to match the requested input names for simplicity, OR alias them. */}
        {/* Let's check the requirement 4 again: "{{name}} -> user_name input". This means the variable in EmailJS is 'name', and it pulls from an input named 'user_name'. */}
        {/* I will add hidden inputs with the exact names EmailJS expects, populated by the RHF values, to ensure 100% compatibility without breaking the existing validation schema names if they differ. */}
        {/* Actually, looking at the schema: name, email, budget, revenue, message. */}
        {/* Required mappings: */}
        {/* user_name -> {{name}} */}
        {/* user_email -> {{email}} */}
        {/* budget -> {{budget}} */}
        {/* monthly_revenue -> {{monthly_revenue}} */}
        {/* service -> {{service}} */}
        {/* message -> {{message}} */}
        
        {/* I will populate hidden inputs for user_name and user_email to match the request strictly, while keeping the visible RHF inputs as is, or just change the name props on the visible inputs if RHF allows (it does, if I update schema keys). */}
        {/* Updating schema keys is cleaner. */}
        {/* Schema keys: name -> user_name, email -> user_email, budget -> budget, revenue -> monthly_revenue, message -> message. */}
        {/* I'll update the schema and the field names. */}

        <input type="hidden" name="user_name" value={form.watch("name")} />
        <input type="hidden" name="user_email" value={form.watch("email")} />
        <input type="hidden" name="monthly_revenue" value={form.watch("revenue")} />
        {/* Removed duplicate hidden inputs for budget and message */}


        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-neutral-400">$</span>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="Estimated Budget" 
                      {...field} 
                      className="pl-7 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="revenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Monthly Revenue</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-neutral-400">$</span>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="Current Monthly Revenue" 
                      {...field} 
                      className="pl-7 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base text-neutral-200">Services</FormLabel>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-neutral-800 p-3 hover:bg-neutral-800/50 transition-colors cursor-pointer relative"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                              className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black mt-0.5 pointer-events-none"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-neutral-300 cursor-pointer w-full select-none pointer-events-none">
                            {item.label}
                          </FormLabel>
                          {/* Invisible overlay to handle the click for the entire box */}
                          <div 
                            className="absolute inset-0 z-10" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const currentServices = field.value || [];
                              const isChecked = currentServices.includes(item.id);
                              
                              if (isChecked) {
                                field.onChange(currentServices.filter((value) => value !== item.id));
                              } else {
                                field.onChange([...currentServices, item.id]);
                              }
                            }}
                          />
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help you?" {...field} className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 min-h-[120px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitStatus === "success" && (
          <div className="text-green-400 font-medium text-center bg-green-400/10 p-3 rounded-lg">
            Message Sent Successfully!
          </div>
        )}
        
        {submitStatus === "error" && (
          <div className="text-red-400 font-medium text-center bg-red-400/10 p-3 rounded-lg">
            Something went wrong. Please try again.
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
