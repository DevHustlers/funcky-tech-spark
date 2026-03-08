const stats = [
  { value: "50K+", label: "Developers" },
  { value: "120", label: "Countries" },
  { value: "2.4K", label: "Projects shipped" },
  { value: "98%", label: "Would recommend" },
];

const StatsSection = () => {
  return (
    <section id="community" className="py-20 px-6 border-y border-border bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
