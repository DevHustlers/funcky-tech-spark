import { Code2, Users, Zap, Globe, MessageSquare, Rocket } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Open Source First",
    desc: "Collaborate on projects that matter. Every contribution counts.",
  },
  {
    icon: Users,
    title: "Global Community",
    desc: "Connect with 50K+ developers from 120 countries worldwide.",
  },
  {
    icon: Zap,
    title: "Weekly Hackathons",
    desc: "Build, ship, and learn together with structured weekly challenges.",
  },
  {
    icon: Globe,
    title: "Remote Friendly",
    desc: "Async-first culture. Collaborate across timezones seamlessly.",
  },
  {
    icon: MessageSquare,
    title: "Mentorship",
    desc: "Get guidance from senior engineers at top tech companies.",
  },
  {
    icon: Rocket,
    title: "Launch Support",
    desc: "From idea to launch — get feedback, beta testers, and support.",
  },
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Everything you need</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for developers,{" "}
            <span className="font-serif italic text-muted-foreground">by developers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-card hover:bg-accent/50 border border-transparent hover:border-border transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
