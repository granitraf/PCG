import { ButtonColorful } from "@/components/ui/button-colorful"
import { ButtonPortfolio } from "@/components/ui/button-portfolio"

export function ButtonDemo() {
  return (
        <div className="flex gap-4">
            <ButtonColorful />
            <ButtonPortfolio />
      </div>
    )
}

export { ButtonColorful, ButtonPortfolio }
