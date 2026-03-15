import { NavLink, Link } from "react-router-dom";
import {
  Users,
  Trophy,
  Zap,
  Calendar,
  Settings,
  BarChart3,
  ArrowLeft,
  Play,
  Award,
  Globe,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useLanguage } from "@/i18n/LanguageContext";
import type { User } from "@supabase/supabase-js";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: User | null;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, user }: SidebarProps) => {
  const { t } = useLanguage();
  
  const sidebarItems = [
    { label: t("dash.overview"), icon: BarChart3, path: "/dashboard" },
    { label: t("dash.users"), icon: Users, path: "/dashboard/users" },
    { label: t("dash.tracks"), icon: Globe, path: "/dashboard/tracks" },
    {
      label: t("dash.challenges"),
      icon: Trophy,
      path: "/dashboard/challenges",
    },
    {
      label: t("dash.competitions"),
      icon: Play,
      path: "/dashboard/competitions",
    },
    { label: t("dash.events"), icon: Calendar, path: "/dashboard/events" },
    { label: t("dash.points"), icon: Zap, path: "/dashboard/points" },
    { label: t("dash.badges"), icon: Award, path: "/dashboard/badges" },
    { label: t("dash.settings"), icon: Settings, path: "/dashboard/settings" },
  ];

  const userInitial = user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "A";
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.username || "Admin";
  const userEmail = user?.email || "admin@dvh.dev";

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border
        w-64 sm:w-64 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        <div className="h-14 border-b border-sidebar-border flex items-center px-3 sm:px-5">
          <Logo />
        </div>
        <nav className="flex-1 py-4 px-0 space-y-0.5 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <div key={item.path}>
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 sm:px-5 py-2.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
              {index === 2 || index === 5 || index === 7 ? (
                <div className="border-t border-sidebar-border mx-3 sm:mx-5 my-2" />
              ) : null}
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 px-3 sm:px-5 py-3 text-[12px] font-mono text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            <span>{t("dash.back_to_site")}</span>
          </Link>
        </div>
        <div className="p-3 sm:p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-[11px] font-bold font-mono text-sidebar-accent-foreground shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-sidebar-accent-foreground truncate">
                {userName}
              </p>
              <p className="text-[11px] text-sidebar-foreground font-mono truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
