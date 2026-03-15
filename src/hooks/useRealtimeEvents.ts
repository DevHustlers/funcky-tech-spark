import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getEvents } from '@/services/events.service';
import type { Tables } from '@/types/database';

export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<Tables<'events'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    const { data, error } = await getEvents();
    if (error) {
      setError(error);
    } else if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading, error, refresh: fetchEvents };
};
