import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

// Helper for class merging
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

const faqData = [
  {
    question: "Who We Are",
    answer: "We are a team of like minded creatives all focused on helping businesses reach their fullest potentials. The majority of our team owns their own companies and has their own skin in the game, we know exactly what to do to get you to the top."
  },
  {
    question: "What We Do",
    answer: "PCG specializes in creative problem solving. Our team focuses on unique and fresh approaches to industry wide problems to help our clients find new ways to scale."
  },
  {
    question: "How We Work",
    answer: "We operate with full transparency with our clients. Using software to create detailed reports that help our clients understand exactly where their money is going. Transparent design flows that ensure you are on the right track to reaching your creative goal."
  }
];

interface FAQItemProps {
  item: { question: string; answer: string };
  isOpen: boolean;
  toggle: () => void;
}

const FAQItem = ({ item, isOpen, toggle }: FAQItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | number>(0);

  useEffect(() => {
    if (isOpen) {
      const scrollHeight = contentRef.current?.scrollHeight;
      setHeight(scrollHeight || 'auto');
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div 
      className={classNames(
        "w-full overflow-hidden rounded-2xl border bg-[#111] transition-all duration-500 ease-out",
        isOpen ? "border-neutral-700 bg-[#161616]" : "border-[#1e1e1e] hover:border-neutral-800 hover:bg-[#141414]"
      )}
    >
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-lg font-medium text-neutral-200 tracking-wide">
          {item.question}
        </span>
        <div className="relative flex h-6 w-6 items-center justify-center">
          <Plus 
            className={classNames(
              "absolute h-5 w-5 text-neutral-400 transition-all duration-500 ease-out",
              isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            )} 
          />
          <X 
            className={classNames(
              "absolute h-5 w-5 text-neutral-200 transition-all duration-500 ease-out",
              isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            )} 
          />
        </div>
      </button>

      <div 
        style={{ height }}
        className="transition-[height] duration-500 ease-out overflow-hidden"
      >
        <div 
          ref={contentRef} 
          className={classNames(
            "px-6 pb-6 text-neutral-400 transition-all duration-500 ease-out",
            isOpen ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-sm -translate-y-2"
          )}
        >
          <p className="leading-relaxed text-sm md:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {faqData.map((item, index) => (
        <FAQItem 
          key={index} 
          item={item} 
          isOpen={openIndex === index} 
          toggle={() => handleToggle(index)} 
        />
      ))}
    </div>
  );
}

