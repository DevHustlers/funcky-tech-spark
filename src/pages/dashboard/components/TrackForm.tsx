import { useState } from "react";
import { X, Check, Sparkles, Flame, Rocket, Gem, Crown, Star, Heart, Trophy, Shield, Target, Swords, Diamond, Hexagon, Compass, Anchor, Lightbulb, Bolt, Medal, BadgeCheck, Zap } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldTextarea } from "./ui/FieldTextarea";
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

interface TrackData {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

// ─── Track Form ───
export const TrackForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: TrackData;
  onSave: (data: TrackData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [selectedIcon, setSelectedIcon] = useState(
    AVAILABLE_ICONS.find(i => i.name === initial?.iconName) || AVAILABLE_ICONS[0]
  );

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(autoSlug(val));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id || `tr-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || autoSlug(name),
      description,
      iconName: selectedIcon.name,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Name</FieldLabel>
            <FieldInput value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Frontend" />
          </div>
          <div>
            <FieldLabel>Slug</FieldLabel>
            <FieldInput value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. frontend" />
          </div>
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of the track..." />
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
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!name.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save Changes" : "Add Track"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
