import { useState } from "react";
import { Check } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

interface CompetitionQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

// ─── Question Form Component ───
export const QuestionForm = ({
  onAdd,
  onCancel,
  defaultTimeLimit = 15,
}: {
  onAdd: (q: CompetitionQuestion) => void;
  onCancel: () => void;
  defaultTimeLimit?: number;
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [timeLimit, setTimeLimit] = useState(defaultTimeLimit);

  const canAdd = question.trim() && options.every(o => o.trim());

  return (
    <div className="p-4 bg-accent/20 space-y-3 border-t border-border">
      <div>
        <FieldLabel>Question</FieldLabel>
        <FieldInput value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter question..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setCorrectIdx(i)}
              className={`w-7 h-7 shrink-0 flex items-center justify-center border text-[11px] font-mono font-bold transition-colors ${
                correctIdx === i
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {["A", "B", "C", "D"][i]}
            </button>
            <FieldInput
              value={opt}
              onChange={e => {
                const u = [...options];
                u[i] = e.target.value;
                setOptions(u);
              }}
              placeholder={`Option ${["A", "B", "C", "D"][i]}`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <FieldLabel>Time (s)</FieldLabel>
          <FieldInput type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={5} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-4">Click A/B/C/D to mark correct answer (green = correct)</p>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryBtn onClick={() => { if (canAdd) onAdd({ id: Date.now(), question, options: [...options], correctIndex: correctIdx, timeLimit }); }} disabled={!canAdd}>
          <Check className="w-3 h-3" /> Add
        </PrimaryBtn>
        <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
      </div>
    </div>
  );
};
