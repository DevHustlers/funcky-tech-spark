import { useState } from "react";
import { X, Check, CirclePlus } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldTextarea } from "./ui/FieldTextarea";
import { FieldSelect } from "./ui/FieldSelect";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";
import { QuestionForm } from "./QuestionForm";
import { QuestionList } from "./QuestionList";

import { CompetitionData, CompetitionQuestion } from "@/types/competition";

import { competitionSchema } from "@/lib/validation/competition.schema";
import { toast } from "sonner";

// ─── Competition Form (create/edit) ───
export const CompetitionForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
}: {
  initial?: CompetitionData;
  onSave: (data: CompetitionData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  loading?: boolean;
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [scheduledDate, setScheduledDate] = useState(initial?.scheduledDate || "");
  const [timePerQuestion, setTimePerQuestion] = useState(initial?.timePerQuestion || 15);
  const [prize, setPrize] = useState(initial?.prize || "");
  const [status, setStatus] = useState<CompetitionData["status"]>(initial?.status || "draft");
  const [questions, setQuestions] = useState<CompetitionQuestion[]>(initial?.questions || []);
  const [showAddQ, setShowAddQ] = useState(false);

  const handleSave = () => {
    const dataToValidate = {
      title: title.trim(),
      description: description.trim(),
      status: status === "scheduled" ? "upcoming" : (status === "ended" ? "completed" : status), // Map to DB types
      scheduled_date: scheduledDate.trim(),
      time_per_question: timePerQuestion,
      prize: prize.trim(),
      questions,
    };

    const validation = competitionSchema.safeParse(dataToValidate);
    
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    onSave({
      id: initial?.id || `comp-${Date.now()}`,
      ...dataToValidate,
      status, // Pass original status back for UI
      scheduledDate: dataToValidate.scheduled_date,
      timePerQuestion: dataToValidate.time_per_question,
      participants: initial?.participants || 0,
      questions,
    } as CompetitionData);
  };

  const removeQuestion = (idx: number) => setQuestions(prev => prev.filter((_, i) => i !== idx));
  const editQuestion = (idx: number, q: CompetitionQuestion) => setQuestions(prev => prev.map((old, i) => i === idx ? q : old));
  const reorderQuestion = (from: number, to: number) => {
    setQuestions(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Title</FieldLabel>
            <FieldInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Frontend Mastery Showdown" />
          </div>
          <div>
            <FieldLabel>Prize</FieldLabel>
            <FieldInput value={prize} onChange={e => setPrize(e.target.value)} placeholder="e.g. 500 pts + Gold Badge" />
          </div>
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the competition..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Scheduled Date</FieldLabel>
            <FieldInput value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} placeholder="e.g. Mar 15, 2026 — 8:00 PM" />
          </div>
          <div>
            <FieldLabel>Time per Question (s)</FieldLabel>
            <FieldInput type="number" value={timePerQuestion} onChange={e => setTimePerQuestion(Number(e.target.value))} min={5} />
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as CompetitionData["status"])}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </FieldSelect>
          </div>
        </div>

        <div className="border border-border">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-foreground">
              Questions <span className="text-muted-foreground font-normal">({questions.length})</span>
            </h4>
            <button
              onClick={() => setShowAddQ(true)}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CirclePlus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          {questions.length === 0 && !showAddQ && (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] text-muted-foreground">No questions added yet</p>
            </div>
          )}

          <QuestionList questions={questions} onRemove={removeQuestion} onEdit={editQuestion} onReorder={reorderQuestion} />

          {showAddQ && (
            <QuestionForm
              defaultTimeLimit={timePerQuestion}
              onAdd={(q) => { setQuestions(prev => [...prev, q]); setShowAddQ(false); }}
              onCancel={() => setShowAddQ(false)}
            />
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn 
            onClick={handleSave} 
            disabled={!title.trim() || loading}
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isEdit ? "Save Changes" : "Create Competition"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
