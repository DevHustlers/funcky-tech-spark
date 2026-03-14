import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  Play,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { EventForm } from "./components/EventForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type:
    | "hackathon"
    | "workshop"
    | "competition"
    | "meetup"
    | "webinar"
    | "system";
  status: "draft" | "upcoming" | "live" | "ended" | "scheduled";
  capacity: number;
  registered: number;
  link: string;
}

const MOCK_EVENTS: EventData[] = [
  {
    id: "ev-1",
    title: "Frontend Hackathon 2026",
    description:
      "Build innovative frontend projects in 48 hours. Show off your React, Vue, and CSS skills!",
    date: "Mar 15, 2026",
    time: "10:00 AM",
    location: "Online — Discord",
    type: "hackathon",
    status: "upcoming",
    capacity: 200,
    registered: 142,
    link: "https://discord.gg/hackathon",
  },
  {
    id: "ev-2",
    title: "AI Workshop: Building LLMs",
    description:
      "Hands-on workshop on building AI-powered applications with large language models.",
    date: "Mar 22, 2026",
    time: "2:00 PM",
    location: "Online — Zoom",
    type: "workshop",
    status: "upcoming",
    capacity: 100,
    registered: 67,
    link: "",
  },
  {
    id: "ev-3",
    title: "Monthly Challenge Reset",
    description:
      "New challenges released for the month. Get ready for fresh tasks!",
    date: "Apr 1, 2026",
    time: "12:00 AM",
    location: "Platform",
    type: "system",
    status: "scheduled",
    capacity: 0,
    registered: 0,
    link: "",
  },
  {
    id: "ev-4",
    title: "Cybersecurity CTF Tournament",
    description:
      "Capture the flag competition for all skill levels. Test your hacking skills!",
    date: "Apr 10, 2026",
    time: "6:00 PM",
    location: "Online — Platform",
    type: "competition",
    status: "draft",
    capacity: 150,
    registered: 0,
    link: "",
  },
  {
    id: "ev-5",
    title: "Community Meetup #15",
    description:
      "Monthly community gathering to share projects and network with fellow developers.",
    date: "Apr 15, 2026",
    time: "7:00 PM",
    location: "Online — Google Meet",
    type: "meetup",
    status: "draft",
    capacity: 50,
    registered: 0,
    link: "",
  },
  {
    id: "ev-6",
    title: "DevOps Summit 2026",
    description:
      "Learn about Docker, Kubernetes, and CI/CD best practices from industry experts.",
    date: "Apr 20, 2026",
    time: "9:00 AM",
    location: "Online — YouTube",
    type: "webinar",
    status: "draft",
    capacity: 500,
    registered: 0,
    link: "",
  },
  {
    id: "ev-7",
    title: "Mobile App Challenge",
    description: "Build a mobile app using React Native or Flutter in 2 weeks.",
    date: "Apr 25, 2026",
    time: "12:00 PM",
    location: "Online — Discord",
    type: "hackathon",
    status: "draft",
    capacity: 100,
    registered: 0,
    link: "",
  },
  {
    id: "ev-8",
    title: "Python Data Science Webinar",
    description:
      "Deep dive into pandas, numpy, and machine learning with Python.",
    date: "May 1, 2026",
    time: "3:00 PM",
    location: "Online — Zoom",
    type: "webinar",
    status: "draft",
    capacity: 200,
    registered: 0,
    link: "",
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

export default function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
  const [eventFormMode, setEventFormMode] = useState<
    "none" | "create" | "edit"
  >("none");
  const [editingEvent, setEditingEvent] = useState<EventData | undefined>();

  const saveEvent = (event: EventData) => {
    if (eventFormMode === "edit") {
      setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents((prev) => [event, ...prev]);
    }
    setEventFormMode("none");
    setEditingEvent(undefined);
  };

  const deleteEvent = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex items-center justify-between">
          <p className="text-[13px] text-muted-foreground">
            {t("dash.managing")}{" "}
            <span className="text-foreground font-medium">{events.length}</span>{" "}
            {t("dash.events")}
          </p>
          <PrimaryBtn
            onClick={() => {
              setEventFormMode("create");
              setEditingEvent(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> {t("dash.new_event")}
          </PrimaryBtn>
        </div>
        </div>

        <BottomDrawer
          open={eventFormMode !== "none"}
          onClose={() => {
            setEventFormMode("none");
            setEditingEvent(undefined);
          }}
          title={eventFormMode === "edit" ? t("dash.edit_event") : t("dash.new_event")}
        >
          <EventForm
            initial={editingEvent}
            isEdit={eventFormMode === "edit"}
            onSave={saveEvent}
            onCancel={() => {
              setEventFormMode("none");
              setEditingEvent(undefined);
            }}
          />
        </BottomDrawer>

        <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
              {t("dash.event_timeline")}
            </h3>
          </div>
          <div className="relative p-3 sm:p-4 space-y-3">
            <div className="absolute start-4 sm:start-6 top-3 bottom-3 w-px bg-border rtl:start-auto rtl:end-4 sm:rtl:end-6 group-hover:bg-primary/20 transition-colors duration-300" />
            {events.map((event) => (
              <div
                key={event.id}
                className="relative flex gap-3 sm:gap-4"
              >
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 border border-border bg-background flex items-center justify-center rounded-xl shrink-0 mt-0.5">
                  {event.status === "upcoming" ? (
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  ) : event.status === "live" ? (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  ) : event.status === "scheduled" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  ) : (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3 sm:pb-4 last:pb-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    <h4 className="text-[12px] sm:text-[14px] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider shrink-0 ${statusBadge(event.status)}`}
                    >
                      {event.status}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border border-border text-muted-foreground uppercase tracking-wider shrink-0">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-muted-foreground mb-2 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[12px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.location}
                    </span>
                    {event.capacity > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.registered}/
                        {event.capacity}
                      </span>
                    )}
                    {event.link && (
                      <span className="flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {t("dash.link")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEventFormMode("edit");
                      setEditingEvent(event);
                    }}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg"
                    title={t("dash.edit")}
                  >
                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                    title={t("dash.delete")}
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
