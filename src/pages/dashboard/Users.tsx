import { useState } from "react";
import { Plus } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { PrimaryBtn } from "./components/ui/PrimaryBtn";
import { UserForm } from "./components/UserForm";
import { UserCard } from "./components/UserCard";
import { UserDetail } from "./components/UserDetail";

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

const MOCK_USERS: UserData[] = [
  { id: "u-1", name: "Sarah Chen", email: "sarah@example.com", joined: "2h ago", points: 12450, status: "active", role: "admin", bio: "Full-stack developer passionate about React and TypeScript." },
  { id: "u-2", name: "Ahmed Hassan", email: "ahmed@example.com", joined: "5h ago", points: 11200, status: "active", role: "moderator", bio: "Backend engineer specializing in Node.js and Python." },
  { id: "u-3", name: "Maria Rodriguez", email: "maria@example.com", joined: "1d ago", points: 10800, status: "active", role: "member", bio: "UI/UX designer turned frontend developer." },
  { id: "u-4", name: "James Park", email: "james@example.com", joined: "2d ago", points: 9650, status: "inactive", role: "member", bio: "Data scientist exploring ML and AI." },
  { id: "u-5", name: "Fatima Al-Sayed", email: "fatima@example.com", joined: "3d ago", points: 8900, status: "active", role: "member", bio: "Cybersecurity enthusiast and CTF player." },
  { id: "u-6", name: "Omar Mostafa", email: "omar@example.com", joined: "4d ago", points: 8450, status: "active", role: "member", bio: "Mobile developer and Flutter enthusiast." },
];

export default function Users() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [userFormMode, setUserFormMode] = useState<"none" | "create" | "edit">("none");
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

  const deleteUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <p className="text-[12px] sm:text-[13px] text-muted-foreground">
                {t("dash.managing")}{" "}
                <span className="text-foreground font-medium">{users.length}</span>{" "}
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
            <UserCard 
              key={user.id}
              user={user}
              onView={setViewingUser}
              onEdit={(u) => {
                setUserFormMode("edit");
                setEditingUser(u);
                setViewingUser(null);
              }}
              onDelete={deleteUser}
            />
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
          onSave={saveUser as any} // Using any temporarily for fast merge
          onCancel={() => {
            setUserFormMode("none");
            setEditingUser(undefined);
          }}
        />
      </BottomDrawer>

      <BottomDrawer open={!!viewingUser} onClose={() => setViewingUser(null)} title="User Details">
        {viewingUser && <UserDetail user={viewingUser} />}
      </BottomDrawer>
    </PageTransition>
  );
}
