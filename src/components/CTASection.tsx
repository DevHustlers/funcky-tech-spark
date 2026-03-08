import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Ready to build{" "}
          <span className="font-serif italic text-muted-foreground">something great</span>
          ?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join a community of developers who care about craft, collaboration, and shipping real products.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors">
            View Projects
          </button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          No credit card required · Free forever for individuals
        </p>
      </div>
    </section>
  );
};

export default CTASection;
