import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-14 px-8 overflow-hidden rounded-full", // Custom height/padding for hero
                "bg-[#005BD1] hover:bg-[#006FFF]", // Custom colors requested
                "shadow-[0_0_20px_rgba(0,71,163,0.5)] hover:shadow-[0_0_30px_rgba(0,91,209,0.7)]", // Underglow shadow
                "transition-all duration-200",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-[#0047A3] via-[#5C9BFF] to-[#B8D7FF]",
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-white font-medium">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-white/90" />
            </div>
        </Button>
    );
}

