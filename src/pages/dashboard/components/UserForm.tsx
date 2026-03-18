import { useState } from "react";
import { X, Check } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldTextarea } from "./ui/FieldTextarea";
import { FieldSelect } from "./ui/FieldSelect";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

interface UserData {
  id: string;
  name: string;
  email: string;
  joined: string;
  points: number;
  status: "active" | "inactive" | "banned";
  role: "member" | "moderator" | "admin";
  bio: string;
}

const USER_STATUS_OPTIONS: UserData["status"][] = ["active", "inactive", "banned"];
const USER_ROLE_OPTIONS: UserData["role"][] = ["member", "moderator", "admin"];

// ─── User Form ───
export const UserForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
}: {
  initial?: UserData;
  onSave: (data: UserData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  loading?: boolean;
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [points, setPoints] = useState(initial?.points || 0);
  const [status, setStatus] = useState<UserData["status"]>(initial?.status || "active");
  const [role, setRole] = useState<UserData["role"]>(initial?.role || "member");
  const [bio, setBio] = useState(initial?.bio || "");

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;
    onSave({
      id: initial?.id || `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      joined: initial?.joined || "Just now",
      points,
      status,
      role,
      bio,
    });
  };

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit User" : "Add User"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <FieldInput value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <FieldInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. john@example.com" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Role</FieldLabel>
            <FieldSelect value={role} onChange={e => setRole(e.target.value as UserData["role"])}>
              {USER_ROLE_OPTIONS.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as UserData["status"])}>
              {USER_STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div>
          <FieldLabel>Bio</FieldLabel>
          <FieldTextarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short user bio..." />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={loading || !name.trim() || !email.trim()}>
            <Check className="w-3.5 h-3.5" /> {loading ? "Saving..." : isEdit ? "Save Changes" : "Add User"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel} disabled={loading}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};
