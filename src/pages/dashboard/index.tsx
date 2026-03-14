import { NavLink, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  Trophy,
  Zap,
  Calendar,
  Settings,
  BarChart3,
  Search,
  ArrowLeft,
  Globe,
  Play,
  Award,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PageTransition from "@/components/PageTransition";
import LightRays from "@/components/LightRays";
import { Particles } from "@/components/Particles";
import { useLanguage } from "@/i18n/LanguageContext";

import Overview from "./Overview";
import UsersPage from "./Users";
import Tracks from "./Tracks";
import Challenges from "./Challenges";
import Competitions from "./Competitions";
import Events from "./Events";
import Points from "./Points";
import Badges from "./Badges";
import SettingsPage from "./Settings";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="absolute inset-0 pointer-events-none dark:hidden opacity-60 overflow-hidden">
        <Particles
          quantity={200}
          size={0.5}
          color="#374151"
          staticity={30}
          ease={40}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        <LightRays
          raysOrigin="top-center"
          raysSpeed={0.5}
          lightSpread={0.4}
          rayLength={3}
          fadeDistance={1}
          saturation={1}
          className="opacity-30"
        />
      </div>

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
              AD
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-sidebar-accent-foreground truncate">
                Admin
              </p>
              <p className="text-[11px] text-sidebar-foreground font-mono truncate">
                admin@dvh.dev
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-64">
        <div className="sticky top-0 z-30 h-14 border-b border-border bg-background/90 backdrop-blur-xl flex items-center justify-between px-3 md:px-6 gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-md md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-foreground capitalize">
                {t("dash.dashboard")}
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest hidden sm:inline">
                {t("dash.admin_panel")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder={t("dash.search")}
                className="h-10 ps-10 pe-4 w-48 lg:w-64 bg-accent/50 border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring font-mono rounded-md"
              />
            </div>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="p-4 md:p-6">
          <PageTransition>
            <div className="relative">
              <div className="relative z-[2]">
                <Routes>
                  <Route index element={<Overview />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="tracks" element={<Tracks />} />
                  <Route path="challenges" element={<Challenges />} />
                  <Route path="competitions" element={<Competitions />} />
                  <Route path="events" element={<Events />} />
                  <Route path="points" element={<Points />} />
                  <Route path="badges" element={<Badges />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </div>
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
