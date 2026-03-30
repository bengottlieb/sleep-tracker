import type { SleepEntry } from '@/lib/types';
import { formatDate, formatTimeDisplay } from '@/lib/timeUtils';

interface Props { entries: SleepEntry[] }

export default function RecentEntries({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="text-base font-medium text-gray-400">Recent Nights</h2>
      </div>
      <div className="divide-y divide-gray-800">
        {entries.map(entry => {
          const planned = formatTimeDisplay(entry.planned_bedtime);
          const actual = formatTimeDisplay(entry.actual_bedtime);
          return (
            <div key={entry.id} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
              <div className="flex gap-5 text-sm">
                <span className="text-indigo-400 tabular-nums">{planned}</span>
                <span className="text-purple-400 tabular-nums">{actual}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end px-5 py-2 border-t border-gray-800">
        <div className="flex gap-5 text-xs text-gray-600">
          <span className="text-indigo-600">Planned</span>
          <span className="text-purple-600">Actual</span>
        </div>
      </div>
    </div>
  );
}
