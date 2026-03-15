import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

import PageTransition from "@/components/PageTransition";
import LightRays from "@/components/LightRays";
import { Particles } from "@/components/Particles";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        user={user} 
      />

      <main className="flex-1 md:ml-64">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

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
