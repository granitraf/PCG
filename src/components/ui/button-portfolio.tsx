import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonPortfolioProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonPortfolio({
    className,
    label = "View Portfolio",
    ...props
}: ButtonPortfolioProps) {
    return (
        <Button
            className={cn(
                "relative h-14 px-8 overflow-hidden rounded-full", // Custom height/padding for hero
                "bg-[#EFF2F5] hover:bg-[#E0E5EA]", // Custom colors requested
                "shadow-[0_0_20px_rgba(126,146,174,0.3)] hover:shadow-[0_0_30px_rgba(126,146,174,0.5)]", // Underglow shadow
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
                    "bg-gradient-to-r from-[#7E92AE] via-[#B0BDC9] to-[#EFF2F5]",
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-black font-medium">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-black/90" />
            </div>
        </Button>
    );
}

