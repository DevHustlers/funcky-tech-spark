import { useState } from "react";
import { X, Check } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldTextarea } from "./ui/FieldTextarea";
import { FieldSelect } from "./ui/FieldSelect";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  track: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  status: "draft" | "upcoming" | "live" | "ended";
  participants: number;
  points: number;
  duration: string;
  requirements: string;
}

const TRACK_OPTIONS = ["Frontend", "Backend", "AI / ML", "Cybersecurity", "Data Science", "DevOps", "Mobile", "Full Stack"];
const DIFFICULTY_OPTIONS: ChallengeData["difficulty"][] = ["Easy", "Medium", "Hard", "Expert"];

import { challengeSchema } from "@/lib/validation/challenge.schema";
import { toast } from "sonner";

// ─── Challenge Form (create/edit) ───
export const ChallengeForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
}: {
  initial?: ChallengeData;
  onSave: (data: ChallengeData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  loading?: boolean;
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [track, setTrack] = useState(initial?.track || TRACK_OPTIONS[0]);
  const [difficulty, setDifficulty] = useState<ChallengeData["difficulty"]>(initial?.difficulty || "Medium");
  const [status, setStatus] = useState<ChallengeData["status"]>(initial?.status || "draft");
  const [points, setPoints] = useState(initial?.points || 500);
  const [duration, setDuration] = useState(initial?.duration || "7 days");
  const [requirements, setRequirements] = useState(initial?.requirements || "");

  const handleSave = () => {
    const dataToValidate = {
      title: title.trim(),
      description: description.trim(),
      track,
      difficulty: difficulty === "Expert" ? "Hard" : difficulty, // Expert is not in DB enum, fallback to Hard
      status,
      points,
      duration,
      requirements,
    };

    const validation = challengeSchema.safeParse(dataToValidate);
    
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    onSave({
      id: initial?.id || `ch-${Date.now()}`,
      ...dataToValidate,
      difficulty, // Keep original for UI if needed, but service will use validation result
      participants: initial?.participants || 0,
    } as ChallengeData);
  };

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <FieldInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Build a Real-Time Chat UI" />
      </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the challenge objective..." />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <FieldLabel>Track</FieldLabel>
            <FieldSelect value={track} onChange={e => setTrack(e.target.value)}>
              {TRACK_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Difficulty</FieldLabel>
            <FieldSelect value={difficulty} onChange={e => setDifficulty(e.target.value as ChallengeData["difficulty"])}>
              {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
          </div>
          <div>
            <FieldLabel>Duration</FieldLabel>
            <FieldInput value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 7 days" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as ChallengeData["status"])}>
              <option value="draft">Draft</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </FieldSelect>
          </div>
        </div>
        <div>
          <FieldLabel>Requirements</FieldLabel>
          <FieldTextarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="List submission requirements..." />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn 
            onClick={handleSave} 
            disabled={!title.trim() || loading}
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isEdit ? "Save Changes" : "Create Challenge"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
