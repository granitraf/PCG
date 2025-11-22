import { ReactNode, MouseEvent } from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 text-white hover:text-neutral-300 text-2xl z-10"
          type="button"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
