'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { SleepEntry } from '@/lib/types';
import { todayDate } from '@/lib/timeUtils';
import EntryForm from '@/components/EntryForm';
import SleepChart from '@/components/SleepChart';
import RecentEntries from '@/components/RecentEntries';

export default function Home() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const today = todayDate();

  const fetchEntries = useCallback(async () => {
    const { data } = await supabase
      .from('sleep_entries')
      .select('*')
      .order('date', { ascending: false })
      .limit(90);
    if (data) setEntries(data as SleepEntry[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const todayEntry = entries.find(e => e.date === today) ?? null;
  const chartEntries = [...entries].reverse();

  return (
    <main className="min-h-screen px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-8 text-indigo-300 tracking-tight">
        Sleep Tracker
      </h1>
      {loading ? (
        <div className="text-center text-gray-500 py-16">Loading…</div>
      ) : (
        <div className="space-y-6">
          <EntryForm entry={todayEntry} date={today} onSaved={fetchEntries} />
          <SleepChart entries={chartEntries} />
          <RecentEntries entries={entries.slice(todayEntry ? 1 : 0, 15)} />
        </div>
      )}
    </main>
  );
}
