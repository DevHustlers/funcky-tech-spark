import { useState } from "react";
import { X, Check } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldTextarea } from "./ui/FieldTextarea";
import { FieldSelect } from "./ui/FieldSelect";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "hackathon" | "workshop" | "competition" | "meetup" | "webinar" | "system";
  status: "draft" | "upcoming" | "live" | "ended" | "scheduled";
  capacity: number;
  registered: number;
  link: string;
}

const EVENT_TYPE_OPTIONS: EventData["type"][] = ["hackathon", "workshop", "competition", "meetup", "webinar", "system"];

import { eventSchema } from "@/lib/validation/event.schema";
import { toast } from "sonner";

// ─── Event Form ───
export const EventForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
}: {
  initial?: EventData;
  onSave: (data: EventData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  loading?: boolean;
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [date, setDate] = useState(initial?.date || "");
  const [time, setTime] = useState(initial?.time || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [type, setType] = useState<EventData["type"]>(initial?.type || "workshop");
  const [status, setStatus] = useState<EventData["status"]>(initial?.status || "draft");
  const [capacity, setCapacity] = useState(initial?.capacity || 100);
  const [link, setLink] = useState(initial?.link || "");

  const handleSave = () => {
    const dataToValidate = {
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      type: type === "webinar" || type === "system" ? "online" : type, // Map to standard types
      status,
      capacity,
      event_link: link.trim(),
    };

    const validation = eventSchema.safeParse(dataToValidate);
    
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    onSave({
      id: initial?.id || `ev-${Date.now()}`,
      ...dataToValidate,
      type, // Pass original type for UI
      registered: initial?.registered || 0,
      link: dataToValidate.event_link,
    } as EventData);
  };

  return (
    <div className="space-y-4">
      <div>
          <FieldLabel>Title</FieldLabel>
          <FieldInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Frontend Hackathon" />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Event description..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Date</FieldLabel>
            <FieldInput value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. Mar 15, 2026" />
          </div>
          <div>
            <FieldLabel>Time</FieldLabel>
            <FieldInput value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 10:00 AM" />
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <FieldInput value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Online — Discord" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Type</FieldLabel>
            <FieldSelect value={type} onChange={e => setType(e.target.value as EventData["type"])}>
              {EVENT_TYPE_OPTIONS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as EventData["status"])}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Capacity</FieldLabel>
            <FieldInput type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div>
          <FieldLabel>Event Link (optional)</FieldLabel>
          <FieldInput value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn 
            onClick={handleSave} 
            disabled={!title.trim() || loading}
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isEdit ? "Save Changes" : "Create Event"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
