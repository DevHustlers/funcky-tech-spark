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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setUser(session.user);
      
      // Fast path check
      if (session.user.user_metadata?.role === 'admin') {
        setIsAdmin(true);
        setLoading(false);
        return; // Exit early if admin role found in metadata
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
        
        if (session.user.user_metadata?.role === 'admin') {
          setIsAdmin(true);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setIsAdmin(profile?.role === 'admin');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">This dashboard is restricted to administrators only. If you believe you should have access, please contact support.</p>
          <a href="/" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Return Home</a>
        </div>
      </div>
    );
  }

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
