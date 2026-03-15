import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { t } = useLanguage();

  return (
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
  );
};

export default Header;
