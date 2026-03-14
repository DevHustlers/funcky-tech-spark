import { useState } from "react";
import { Check, Sparkles, Flame, Rocket, Gem, Crown, Star, Heart, Trophy, Shield, Target, Swords, Diamond, Hexagon, Compass, Anchor, Lightbulb, Bolt, Medal, BadgeCheck, Zap } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

const AVAILABLE_ICONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Flame", icon: Flame },
  { name: "Rocket", icon: Rocket },
  { name: "Gem", icon: Gem },
  { name: "Crown", icon: Crown },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Trophy", icon: Trophy },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "Swords", icon: Swords },
  { name: "Diamond", icon: Diamond },
  { name: "Hexagon", icon: Hexagon },
  { name: "Compass", icon: Compass },
  { name: "Anchor", icon: Anchor },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Bolt", icon: Bolt },
  { name: "Medal", icon: Medal },
  { name: "BadgeCheck", icon: BadgeCheck },
  { name: "Zap", icon: Zap },
];

export const BadgeForm = ({
  onSave,
  onCancel,
}: {
  onSave: (badge: { id: string; nameKey: string; minPoints: number; icon: React.ElementType; iconName: string; colorClass: string; borderClass: string; bgClass: string }) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState("");
  const [minPoints, setMinPoints] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const COLOR_PRESETS = [
    { label: "Zinc", colorClass: "text-zinc-400", borderClass: "border-zinc-400/30", bgClass: "bg-zinc-400/10" },
    { label: "Emerald", colorClass: "text-emerald-500", borderClass: "border-emerald-500/30", bgClass: "bg-emerald-500/10" },
    { label: "Blue", colorClass: "text-blue-500", borderClass: "border-blue-500/30", bgClass: "bg-blue-500/10" },
    { label: "Purple", colorClass: "text-purple-500", borderClass: "border-purple-500/30", bgClass: "bg-purple-500/10" },
    { label: "Amber", colorClass: "text-amber-500", borderClass: "border-amber-500/30", bgClass: "bg-amber-500/10" },
    { label: "Red", colorClass: "text-red-500", borderClass: "border-red-500/30", bgClass: "bg-red-500/10" },
    { label: "Pink", colorClass: "text-pink-500", borderClass: "border-pink-500/30", bgClass: "bg-pink-500/10" },
    { label: "Cyan", colorClass: "text-cyan-500", borderClass: "border-cyan-500/30", bgClass: "bg-cyan-500/10" },
  ];
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Badge Name</FieldLabel>
          <FieldInput value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Champion" />
        </div>
        <div>
          <FieldLabel>Min Points</FieldLabel>
          <FieldInput type="number" value={minPoints} onChange={e => setMinPoints(Number(e.target.value))} min={0} />
        </div>
      </div>
      <div>
        <FieldLabel>Color</FieldLabel>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PRESETS.map(c => (
            <button
              key={c.label}
              onClick={() => setSelectedColor(c)}
              className={`px-3 py-1.5 border text-[12px] font-mono transition-colors ${
                selectedColor.label === c.label ? `${c.borderClass} ${c.bgClass} ${c.colorClass}` : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Icon</FieldLabel>
        <div className="grid grid-cols-10 gap-1">
          {AVAILABLE_ICONS.map(iconOption => {
            const OptionIcon = iconOption.icon;
            const isSelected = selectedIcon.name === iconOption.name;
            return (
              <button
                key={iconOption.name}
                onClick={() => setSelectedIcon(iconOption)}
                className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                  isSelected ? "border-foreground bg-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                <OptionIcon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 border border-border bg-accent/20">
        <div className={`w-10 h-10 flex items-center justify-center border ${selectedColor.borderClass} ${selectedColor.bgClass}`}>
          <selectedIcon.icon className={`w-5 h-5 ${selectedColor.colorClass}`} />
        </div>
        <div>
          <p className={`text-[12px] font-mono font-medium ${selectedColor.colorClass} uppercase tracking-wider`}>{name || "Badge Name"}</p>
          <p className="text-[10px] text-muted-foreground font-mono">{minPoints.toLocaleString()}+ pts</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <PrimaryBtn onClick={() => {
          if (name.trim()) onSave({
            id: `badge-${Date.now()}`,
            nameKey: name.trim(),
            minPoints,
            icon: selectedIcon.icon,
            iconName: selectedIcon.name,
            ...selectedColor,
          });
        }} disabled={!name.trim()}>
          <Check className="w-3.5 h-3.5" /> Create Badge
        </PrimaryBtn>
        <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
      </div>
    </div>
  );
};
