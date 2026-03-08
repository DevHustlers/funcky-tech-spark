import Navbar from "@/components/Navbar";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import heroBg from "@/assets/hero-bg.jpg";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0s" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Now 50,000+ developers strong
            </div>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[1.1] mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            Where developers{" "}
            <span className="font-serif italic text-muted-foreground">come together</span>
            {" "}to build
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            A modern community for programmers who want to collaborate, learn, and ship products that matter.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-up"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-base">
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors text-base">
              Explore Projects
            </button>
          </div>

          {/* Hero image */}
          <div
            className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/5 animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <img
              src={heroBg}
              alt="Abstract modern design representing the DevHive community"
              className="w-full h-auto"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Features */}
      <FeaturesGrid />

      {/* Stats */}
      <StatsSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">D</span>
            </div>
            <span className="font-semibold text-foreground">DevHive</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 DevHive
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
