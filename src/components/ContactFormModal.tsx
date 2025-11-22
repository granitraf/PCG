import { useState } from "react";
import Modal from "./Modal";
import ContactForm from "./ContactForm";
import { ButtonColorful } from "@/components/ui/button-colorful";

export default function ContactFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOOK A MEETING BUTTON */}
      <ButtonColorful
        label="BOOK A MEETING"
        onClick={() => setOpen(true)}
        className="z-50 relative"
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <ContactForm />
      </Modal>
    </>
  );
}

