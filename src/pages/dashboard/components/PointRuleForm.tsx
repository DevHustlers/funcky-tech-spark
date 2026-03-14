import { useState } from "react";
import { X, Check } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

interface PointRule {
  id: string;
  action: string;
  points: number;
  active: boolean;
}

// ─── Point Rule Form ───
export const PointRuleForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: PointRule;
  onSave: (data: PointRule) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [action, setAction] = useState(initial?.action || "");
  const [points, setPoints] = useState(initial?.points || 100);
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Action</FieldLabel>
            <FieldInput value={action} onChange={e => setAction(e.target.value)} placeholder="e.g. Complete a quiz" />
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActive(!active)}
            className={`w-10 h-5 rounded-full relative transition-colors ${active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? "left-5" : "left-0.5"}`} />
          </button>
          <span className="text-[13px] text-foreground">{active ? "Active" : "Inactive"}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={() => { if (action.trim()) onSave({ id: initial?.id || `pr-${Date.now()}`, action: action.trim(), points, active }); }} disabled={!action.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save" : "Add Rule"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
