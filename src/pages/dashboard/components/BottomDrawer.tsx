import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface BottomDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomDrawer({
  open,
  onClose,
  children,
  title,
}: BottomDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const isVisible = open;

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [open]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`absolute bottom-0 left-0 md:left-64 right-0 bg-background/95 backdrop-blur-lg border border-border transition-transform duration-300 ease-out rounded-2xl md:rounded-2xl md:mx-2 md:mb-2 mx-0 mb-0 ${isAnimating ? "translate-y-0" : "translate-y-full"}`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border rounded-t-2xl">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-accent rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 max-h-[70vh] overflow-y-auto rounded-b-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
