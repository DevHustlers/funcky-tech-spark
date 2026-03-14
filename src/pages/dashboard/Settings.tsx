import {
  Check,
  Settings2,
  Shield,
  Bell,
  Globe,
  Zap,
  Trophy,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

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
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40 hover:border-primary/30 transition-all ${className}`}
  />
);

const FieldSelect = ({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-primary/30 transition-all ${className}`}
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
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-lg hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-all duration-300 relative ${checked ? "bg-emerald-500" : "bg-border hover:bg-muted-foreground/30"}`}
  >
    <span
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${checked ? "left-6" : "left-1"}`}
    />
  </button>
);

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                General Settings
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FieldLabel>Community Name</FieldLabel>
                <FieldInput defaultValue="DevHustlers" className="h-10" />
              </div>
              <div>
                <FieldLabel>Default Language</FieldLabel>
                <FieldSelect defaultValue="en" className="h-10">
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </FieldSelect>
              </div>
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <FieldSelect defaultValue="UTC" className="h-10">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Dubai">Dubai</option>
                </FieldSelect>
              </div>
              <PrimaryBtn>
                <Check className="w-3.5 h-3.5" /> Save Settings
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Points Configuration
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FieldLabel>Max Points per Day</FieldLabel>
                <FieldInput
                  defaultValue="1000"
                  type="number"
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>Challenge Duration (days)</FieldLabel>
                <FieldInput defaultValue="7" type="number" className="h-10" />
              </div>
              <div>
                <FieldLabel>Points Expiry (days)</FieldLabel>
                <FieldInput defaultValue="365" type="number" className="h-10" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Streak Bonuses
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Reward consistent daily activity
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <PrimaryBtn>
                <Check className="w-3.5 h-3.5" /> Save Points
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Security
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Email Verification
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Users must verify email
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Account Approval
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Admin must approve new accounts
                  </p>
                </div>
                <ToggleSwitch checked={false} onChange={() => {}} />
              </div>
              <div>
                <FieldLabel>Session Timeout (minutes)</FieldLabel>
                <FieldInput defaultValue="60" type="number" className="h-10" />
              </div>
              <PrimaryBtn>
                <Check className="w-3.5 h-3.5" /> Save Security
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Notifications
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Email Notifications
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Send email for important events
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Challenge Reminders
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Remind users about active challenges
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Leaderboard Updates
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Weekly leaderboard digest
                  </p>
                </div>
                <ToggleSwitch checked={false} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    New Event Alerts
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Notify when new events are scheduled
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <PrimaryBtn>
                <Check className="w-3.5 h-3.5" /> Save Notifications
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Social Links
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FieldLabel>Discord Server</FieldLabel>
                <FieldInput
                  defaultValue="https://discord.gg/devhustlers"
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>Twitter / X</FieldLabel>
                <FieldInput
                  defaultValue="https://twitter.com/devhustlers"
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>GitHub</FieldLabel>
                <FieldInput
                  defaultValue="https://github.com/devhustlers"
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>LinkedIn</FieldLabel>
                <FieldInput
                  defaultValue="https://linkedin.com/company/devhustlers"
                  className="h-10"
                />
              </div>
              <PrimaryBtn>
                <Check className="w-3.5 h-3.5" /> Save Links
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Gamification
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Leaderboard
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Show top users on platform
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Badges
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Users can earn achievement badges
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Streaks
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Track daily login streaks
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Referrals
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Users can refer friends
                  </p>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
              <PrimaryBtn>
                <Check className="w-3.5 h-3.5" /> Save Gamification
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
