import { useState } from "react";
import { Plus, Eye, Pencil, Trash2, Mail } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";

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

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
    {children}
  </label>
);

const FieldInput = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-9 px-3 bg-background/80 backdrop-blur-sm border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40 hover:border-primary/30 transition-all ${className}`}
  />
);

const FieldTextarea = ({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 bg-background/80 backdrop-blur-sm border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40 min-h-[80px] resize-y hover:border-primary/30 transition-all ${className}`}
  />
);

const FieldSelect = ({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full h-9 px-3 bg-background/80 backdrop-blur-sm border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-primary/30 transition-all ${className}`}
  >
    {children}
  </select>
);

const PrimaryBtn = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

const USER_STATUS_OPTIONS: UserData["status"][] = [
  "active",
  "inactive",
  "banned",
];
const USER_ROLE_OPTIONS: UserData["role"][] = ["member", "moderator", "admin"];

const UserForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
  t,
}: {
  initial?: UserData;
  onSave: (data: UserData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  t: (key: string) => string;
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [points, setPoints] = useState(initial?.points || 0);
  const [status, setStatus] = useState<UserData["status"]>(
    initial?.status || "active",
  );
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <FieldInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <FieldInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. john@example.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <FieldLabel>Role</FieldLabel>
          <FieldSelect
            value={role}
            onChange={(e) => setRole(e.target.value as UserData["role"])}
          >
            {USER_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r}
              </option>
            ))}
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <FieldSelect
            value={status}
            onChange={(e) => setStatus(e.target.value as UserData["status"])}
          >
            {USER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>Points</FieldLabel>
          <FieldInput
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div>
        <FieldLabel>Bio</FieldLabel>
        <FieldTextarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Brief bio..."
        />
      </div>
      <PrimaryBtn onClick={handleSave} disabled={!name.trim() || !email.trim()}>
        {isEdit ? t("dash.save_changes") : t("dash.add_user")}
      </PrimaryBtn>
    </div>
  );
};

const MOCK_USERS: UserData[] = [
  {
    id: "u-1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    joined: "2h ago",
    points: 12450,
    status: "active",
    role: "admin",
    bio: "Full-stack developer passionate about React and TypeScript.",
  },
  {
    id: "u-2",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    joined: "5h ago",
    points: 11200,
    status: "active",
    role: "moderator",
    bio: "Backend engineer specializing in Node.js and Python.",
  },
  {
    id: "u-3",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    joined: "1d ago",
    points: 10800,
    status: "active",
    role: "member",
    bio: "UI/UX designer turned frontend developer.",
  },
  {
    id: "u-4",
    name: "James Park",
    email: "james@example.com",
    joined: "2d ago",
    points: 9650,
    status: "inactive",
    role: "member",
    bio: "Data scientist exploring ML and AI.",
  },
  {
    id: "u-5",
    name: "Fatima Al-Sayed",
    email: "fatima@example.com",
    joined: "3d ago",
    points: 8900,
    status: "active",
    role: "member",
    bio: "Cybersecurity enthusiast and CTF player.",
  },
  {
    id: "u-6",
    name: "Omar Mostafa",
    email: "omar@example.com",
    joined: "4d ago",
    points: 8450,
    status: "active",
    role: "member",
    bio: "Mobile developer and Flutter enthusiast.",
  },
  {
    id: "u-7",
    name: "Lisa Wang",
    email: "lisa@example.com",
    joined: "5d ago",
    points: 7800,
    status: "active",
    role: "member",
    bio: "DevOps engineer focusing on cloud infrastructure.",
  },
  {
    id: "u-8",
    name: "John Smith",
    email: "john@example.com",
    joined: "1w ago",
    points: 7200,
    status: "active",
    role: "member",
    bio: "Backend developer specializing in Go and Rust.",
  },
  {
    id: "u-9",
    name: "Emma Wilson",
    email: "emma@example.com",
    joined: "1w ago",
    points: 6900,
    status: "active",
    role: "member",
    bio: "Machine learning engineer and data analyst.",
  },
  {
    id: "u-10",
    name: "Michael Brown",
    email: "michael@example.com",
    joined: "2w ago",
    points: 6500,
    status: "banned",
    role: "member",
    bio: "Full-stack developer.",
  },
  {
    id: "u-11",
    name: "Sofia Garcia",
    email: "sofia@example.com",
    joined: "2w ago",
    points: 6100,
    status: "active",
    role: "member",
    bio: "React Native developer and UI enthusiast.",
  },
  {
    id: "u-12",
    name: "David Lee",
    email: "david@example.com",
    joined: "3w ago",
    points: 5800,
    status: "inactive",
    role: "member",
    bio: "Python developer and automation expert.",
  },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "text-emerald-500 border-emerald-500/30",
    inactive: "text-muted-foreground border-border",
    banned: "text-red-500 border-red-500/30",
    live: "text-emerald-500 border-emerald-500/30",
    upcoming: "text-amber-500 border-amber-500/30",
    ended: "text-muted-foreground border-border",
    scheduled: "text-blue-500 border-blue-500/30",
    draft: "text-muted-foreground border-border",
  };
  return map[status] || "text-muted-foreground border-border";
};

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    admin: "text-amber-500 border-amber-500/30",
    moderator: "text-blue-500 border-blue-500/30",
    member: "text-muted-foreground border-border",
  };
  return map[role] || "text-muted-foreground border-border";
};

export default function Users() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [userFormMode, setUserFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingUser, setEditingUser] = useState<UserData | undefined>();
  const [viewingUser, setViewingUser] = useState<UserData | null>(null);

  const saveUser = (user: UserData) => {
    if (userFormMode === "edit") {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers((prev) => [user, ...prev]);
    }
    setUserFormMode("none");
    setEditingUser(undefined);
  };

  const deleteUser = (id: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <p className="text-[12px] sm:text-[13px] text-muted-foreground">
              {t("dash.managing")}{" "}
              <span className="text-foreground font-medium">
                {users.length}
              </span>{" "}
              {t("dash.users_label")}
            </p>
          </div>
          <PrimaryBtn
            onClick={() => {
              setUserFormMode("create");
              setEditingUser(undefined);
              setViewingUser(null);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("dash.add_user")}</span><span className="sm:hidden">Add</span>
          </PrimaryBtn>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {users.map((user) => (
            <div
              className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent border border-border flex items-center justify-center text-[12px] sm:text-[14px] font-bold font-mono text-foreground shrink-0 rounded-xl group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-[14px] font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono line-clamp-1 group-hover:text-foreground/70 transition-colors">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${roleBadge(user.role)}`}
                >
                  {user.role}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${statusBadge(user.status)}`}
                >
                  {user.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                    Points
                  </p>
                  <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                    {user.points.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={() => {
                      setViewingUser(user);
                      setUserFormMode("none");
                    }}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group/btn"
                    title="View"
                  >
                    <Eye className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      setUserFormMode("edit");
                      setEditingUser(user);
                      setViewingUser(null);
                    }}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group/btn"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomDrawer
        open={userFormMode !== "none"}
        onClose={() => {
          setUserFormMode("none");
          setEditingUser(undefined);
        }}
        title={userFormMode === "edit" ? t("dash.edit_user") : t("dash.add_user")}
      >
        <UserForm
          initial={editingUser}
          isEdit={userFormMode === "edit"}
          onSave={saveUser}
          t={t}
          onCancel={() => {
            setUserFormMode("none");
            setEditingUser(undefined);
          }}
        />
      </BottomDrawer>

      <BottomDrawer
        open={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="User Details"
      >
        {viewingUser && (
          <div>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent border border-border flex items-center justify-center text-[16px] sm:text-[20px] font-bold font-mono text-foreground shrink-0">
                {viewingUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 space-y-2 sm:space-y-3 w-full">
                <div>
                  <h4 className="text-[16px] sm:text-[18px] font-bold text-foreground">
                    {viewingUser.name}
                  </h4>
                  <p className="text-[12px] sm:text-[13px] text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> {viewingUser.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider ${statusBadge(viewingUser.status)}`}
                  >
                    {viewingUser.status}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider ${roleBadge(viewingUser.role)}`}
                  >
                    {viewingUser.role}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                  <div className="border border-border p-2 sm:p-3">
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase">
                      Points
                    </p>
                    <p className="text-[16px] sm:text-[20px] font-bold font-mono text-foreground">
                      {viewingUser.points.toLocaleString()}
                    </p>
                  </div>
                  <div className="border border-border p-2 sm:p-3">
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase">
                      Joined
                    </p>
                    <p className="text-[12px] sm:text-[14px] font-medium text-foreground">
                      {viewingUser.joined}
                    </p>
                  </div>
                  <div className="border border-border p-2 sm:p-3">
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase">
                      Role
                    </p>
                    <p className="text-[12px] sm:text-[14px] font-medium text-foreground capitalize">
                      {viewingUser.role}
                    </p>
                  </div>
                </div>
                {viewingUser.bio && (
                  <div className="pt-2">
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase mb-1">
                      Bio
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-foreground">
                      {viewingUser.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </BottomDrawer>
    </PageTransition>
  );
}
