import { createFileRoute } from '@tanstack/react-router'
import LogoLoop from '@/components/LogoLoop'
import Aurora from '@/components/Aurora'
import FAQAccordion from '@/components/FAQAccordion'
import { SparklesCore } from '@/components/ui/sparkles'
import { ButtonPortfolio } from '@/components/ui/button-portfolio'
import ContactFormModal from '@/components/ContactFormModal'

// Alternative with image sources
const imageLogos = [
  { src: "/logoloop/217.png", alt: "217", href: "#" },
  { src: "/logoloop/alertindex.png", alt: "AlertIndex", href: "#" },
  { src: "/logoloop/bs.png", alt: "BS", href: "#" },
  { src: "/logoloop/curse.png", alt: "Curse", href: "#" },
  { src: "/logoloop/safeplace.png", alt: "Safeplace", href: "#" },
  { src: "/logoloop/visionworld.png", alt: "VisionWorld", href: "#" },
  { src: "/logoloop/synical.png", alt: "Synical", href: "#" }
];

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const mailtoHref = 'mailto:hello@polarcreativegroup.com?subject=PCG%20Meeting%20Request&body=Hi%20PCG%2C%0A%0AI%27m%20interested%20in%20working%20together.%0AHere%27s%20what%20I%27m%20looking%20for%3A%0A';
  return (
    <div className="min-h-screen text-neutral-200 px-6 py-10 relative overflow-hidden font-sans">
      
      {/* Aurora Background - Lowest Layer */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <Aurora 
          colorStops={["#005BD1", "#006FFF", "#8ABDFF"]} 
          blend={0.5} 
          amplitude={1.0} 
          speed={0.5} 
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center z-10">
        
        {/* SECTION 1 — TOP “BOOKING” BADGE */}
        <div className="relative flex flex-col items-center mt-10 w-full">
          {/* Logo */}
          <img
            src="/PolarCreativeGroupLogo.png"
            alt="Polar Creative Group Logo"
            className="w-64 md:w-96 mb-10 opacity-95"
          />

          <div className="relative w-full max-w-[28rem] md:max-w-[32rem]">
            {/* Glow line directly under the logo */}
            <div className="relative w-full h-6 -mt-6 mb-2 z-10">
              <div className="absolute inset-x-4 top-0 bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent h-[3px] blur-sm" />
              <div className="absolute inset-x-4 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-px" />
              <div className="absolute inset-x-12 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-[4px] blur-sm" />
              <div className="absolute inset-x-12 top-0 bg-gradient-to-r from-transparent via-sky-300 to-transparent h-px" />
            </div>

            {/* Snow (sparkles) as a background layer starting below the glow line */}
            <div className="pointer-events-none absolute inset-x-0 top-[-24px] w-full h-80 z-0">
              <div
                className="relative w-full h-full"
                style={{
                  maskImage: 'radial-gradient(400px 350px at top, white, transparent)',
                  WebkitMaskImage: 'radial-gradient(400px 350px at top, white, transparent)',
                }}
                aria-hidden="true"
              >
                <SparklesCore
                  id="tsparticlesfullpage"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={400}
                  particleColor="#FFFFFF"
                  speed={1}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          
          <span className="px-4 py-1 rounded-full text-xs bg-[#1e69e0] text-[#bad7ff] tracking-wide font-medium border border-[#1652b2] flex items-center gap-2 relative z-20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5757] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[radial-gradient(circle,#ff0909_0%,#990000_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></span>
            </span>
            <span className="drop-shadow-[0_0_8px_rgba(186,215,255,0.8)] text-shadow-[0_0_10px_rgba(186,215,255,0.5)]">BOOKING FOR Q1 2026</span>
          </span>
        </div>

        {/* SECTION 2 — HERO TEXT + MAIN CTA */}
        <div className="text-center mt-12 space-y-8 max-w-3xl relative z-30">
          <h1 className="text-4xl md:text-6xl font-semibold text-neutral-200 leading-[1.1] tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Your All-in-One <span className="italic font-semibold drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">Creative Hub</span><br className="hidden md:block" />
            <span className="text-xl md:text-3xl block mt-6 font-light drop-shadow-none">Solutions at your fingertips</span>
          </h1>
          
          <div className="pt-2 w-full flex flex-col items-center">
            <ContactFormModal />
            
            <div className="w-full flex justify-center my-12 md:my-16 overflow-hidden">
              {/* Basic horizontal loop */}
              <LogoLoop
                logos={imageLogos as any}
                speed={90}
                direction="left"
                logoHeight={100}
                gap={40}
                hoverSpeed={30}
                scaleOnHover
                ariaLabel="Partners"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3 — VIDEO PLACEHOLDER (NO VIDEO) */}
        <div 
          className="w-full max-w-3xl mt-0 aspect-video bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center shadow-2xl shadow-black/50"
          aria-label="highlight reel 30 secs–1 min"
        >
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-neutral-200 text-2xl shadow-lg hover:bg-red-500 transition-colors cursor-pointer">
            <span className="ml-1">▶</span>
          </div>
        </div>

        {/* SECTION 4 — SECOND HEADLINE + CTA */}
        <div className="text-center mt-24 space-y-6 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-semibold text-neutral-200 tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            See the Work Behind the Results.
          </h2>
          
          <div className="pt-2">
            <ButtonPortfolio
              label="VIEW OUR PORTFOLIO"
              onClick={() => window.open("https://www.figma.com/design/87o3htBweaHRyGs9kXW2Ac/PCG---PORTFOLIO?node-id=0-1&p=f", "_blank")}
            />
          </div>
        </div>

        {/* SECTION 5 — THREE DROPDOWN Q&A BOXES */}
        <div className="mt-20 w-full max-w-xl">
          <FAQAccordion />
        </div>


      </div>
    </div>
  )
}
