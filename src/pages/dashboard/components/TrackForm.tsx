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
  long_description: string;
  iconName: string;
  color?: string;
}

import { trackSchema } from "@/lib/validation/track.schema";
import { toast } from "sonner";

// ─── Track Form ───
export const TrackForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
}: {
  initial?: TrackData;
  onSave: (data: TrackData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  loading?: boolean;
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [longDescription, setLongDescription] = useState(initial?.long_description || "");
  const [selectedIcon, setSelectedIcon] = useState(
    AVAILABLE_ICONS.find(i => i.name === initial?.iconName) || AVAILABLE_ICONS[0]
  );
  const [color, setColor] = useState(initial?.color || "#3b82f6");

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(autoSlug(val));
  };

  const handleSave = () => {
    const dataToValidate = {
      name: name.trim(),
      slug: slug.trim() || autoSlug(name),
      description: description.trim(),
      long_description: longDescription.trim(),
      icon_key: selectedIcon.name,
      color: color.trim(),
    };

    const validation = trackSchema.safeParse(dataToValidate);

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    onSave({
      id: initial?.id || `tr-${Date.now()}`,
      ...dataToValidate,
      iconName: selectedIcon.name,
    } as any);
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
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." />
        </div>
        <div>
          <FieldLabel>Long Description</FieldLabel>
          <FieldTextarea value={longDescription} onChange={e => setLongDescription(e.target.value)} placeholder="Full track details..." className="h-32" />
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
        <div>
          <FieldLabel>Color</FieldLabel>
          <div className="flex items-center gap-4">
            <input 
              type="color" 
              value={color} 
              onChange={e => setColor(e.target.value)} 
              className="w-10 h-10 border-none bg-transparent cursor-pointer p-0"
            />
            <FieldInput 
              value={color} 
              onChange={e => setColor(e.target.value)} 
              placeholder="#3b82f6" 
              className="font-mono text-[12px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn 
            onClick={handleSave} 
            disabled={!name.trim() || loading}
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isEdit ? "Save Changes" : "Add Track"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
