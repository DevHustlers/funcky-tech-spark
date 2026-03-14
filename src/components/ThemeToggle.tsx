import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDark(saved === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!mounted.current || dark === null) return;
    
    setIsTransitioning(true);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (dark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", dark ? "dark" : "light");
      });
    });

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [dark]);

  const handleToggle = () => {
    if (dark !== null) {
      setDark(!dark);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-200 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        } ${dark === true ? 'bg-black' : dark === false ? 'bg-white' : 'bg-transparent'}`}
      />
      <button
        onClick={handleToggle}
        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative z-[10000]"
        aria-label="Toggle theme"
      >
        {dark === null ? (
          <div className="w-4 h-4" />
        ) : dark ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>
    </>
  );
};

export default ThemeToggle;
