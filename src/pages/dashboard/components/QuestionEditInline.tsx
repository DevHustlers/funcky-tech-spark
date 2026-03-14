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

// ─── Inline question edit ───
export const QuestionEditInline = ({
  question,
  onSave,
  onCancel,
}: {
  question: CompetitionQuestion;
  onSave: (q: CompetitionQuestion) => void;
  onCancel: () => void;
}) => {
  const [q, setQ] = useState(question.question);
  const [opts, setOpts] = useState([...question.options]);
  const [correct, setCorrect] = useState(question.correctIndex);
  const [time, setTime] = useState(question.timeLimit);

  return (
    <div className="space-y-3">
      <FieldInput value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setCorrect(i)}
              className={`w-6 h-6 shrink-0 flex items-center justify-center border text-[10px] font-mono font-bold transition-colors ${
                correct === i ? "border-emerald-500 bg-emerald-500 text-white" : "border-border text-muted-foreground"
              }`}
            >
              {["A","B","C","D"][i]}
            </button>
            <FieldInput value={o} onChange={e => { const u = [...opts]; u[i] = e.target.value; setOpts(u); }} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24">
          <FieldLabel>Time (s)</FieldLabel>
          <FieldInput type="number" value={time} onChange={e => setTime(Number(e.target.value))} min={5} />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <PrimaryBtn onClick={() => onSave({ ...question, question: q, options: opts, correctIndex: correct, timeLimit: time })}>
            <Check className="w-3 h-3" /> Save
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};
