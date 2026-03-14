import { useState } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { FieldInput } from "./ui/FieldInput";
import { QuestionEditInline } from "./QuestionEditInline";

interface CompetitionQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

// ─── Question List Component ───
export const QuestionList = ({
  questions,
  onRemove,
  onEdit,
  onReorder,
}: {
  questions: CompetitionQuestion[];
  onRemove: (idx: number) => void;
  onEdit: (idx: number, q: CompetitionQuestion) => void;
  onReorder: (from: number, to: number) => void;
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  return (
    <div>
      {questions.map((q, i) => (
        <div key={q.id} className="px-4 py-3 border-b border-border last:border-b-0">
          {editingIdx === i ? (
            <QuestionEditInline
              question={q}
              onSave={(updated) => { onEdit(i, updated); setEditingIdx(null); }}
              onCancel={() => setEditingIdx(null)}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-[11px] font-mono text-muted-foreground w-6 shrink-0">Q{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{q.question}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Correct: {q.options[q.correctIndex]} · {q.timeLimit}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {i > 0 && (
                  <button onClick={() => onReorder(i, i - 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {i < questions.length - 1 && (
                  <button onClick={() => onReorder(i, i + 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => setEditingIdx(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onRemove(i)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
