import { Github, Twitter, ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-foreground text-lg">DevHive</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">Community</a>
          <a href="#events" className="text-muted-foreground hover:text-foreground transition-colors">Events</a>
          <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Join Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
