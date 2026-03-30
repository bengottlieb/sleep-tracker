'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SleepEntry } from '@/lib/types';
import { formatTimeForInput, formatDate } from '@/lib/timeUtils';

interface Props {
  entry: SleepEntry | null;
  date: string;
  onSaved: () => void;
}

export default function EntryForm({ entry, date, onSaved }: Props) {
  const [planned, setPlanned] = useState('');
  const [actual, setActual] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPlanned(formatTimeForInput(entry?.planned_bedtime ?? null));
    setActual(formatTimeForInput(entry?.actual_bedtime ?? null));
    setSaved(false);
  }, [entry]);

  const save = async () => {
    setSaving(true);
    const payload = {
      date,
      planned_bedtime: planned || null,
      actual_bedtime: actual || null,
      updated_at: new Date().toISOString(),
    };
    if (entry) {
      await supabase.from('sleep_entries').update(payload).eq('id', entry.id);
    } else {
      await supabase.from('sleep_entries').insert(payload);
    }
    setSaving(false);
    setSaved(true);
    onSaved();
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 space-y-5 border border-gray-800">
      <h2 className="text-base font-medium text-gray-400">
        Today &mdash; {formatDate(date)}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Planned
          </label>
          <input
            type="time"
            value={planned}
            onChange={e => { setPlanned(e.target.value); setSaved(false); }}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-base text-center text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-purple-400">
            Actual
          </label>
          <input
            type="time"
            value={actual}
            onChange={e => { setActual(e.target.value); setSaved(false); }}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-base text-center text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-base"
      >
        {saving ? 'Saving…' : saved ? 'Saved' : entry ? 'Update' : 'Save'}
      </button>
    </div>
  );
}
