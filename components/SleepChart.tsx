'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { SleepEntry } from '@/lib/types';
import { timeToDecimal, decimalToTimeLabel, formatDate } from '@/lib/timeUtils';

interface Props { entries: SleepEntry[] }

interface ChartPoint {
  label: string;
  planned: number | null | undefined;
  actual: number | null | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TimeTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} dy={4} textAnchor="end" fill="#9ca3af" fontSize={11}>
    {decimalToTimeLabel(payload.value)}
  </text>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TimeTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-gray-400 mb-1 text-xs">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => p.value != null && (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {decimalToTimeLabel(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function SleepChart({ entries }: Props) {
  if (entries.filter(e => e.planned_bedtime || e.actual_bedtime).length < 2) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 text-center text-gray-600 border border-gray-800 text-sm">
        Add a few entries to see your trend
      </div>
    );
  }

  const data: ChartPoint[] = entries.map(e => ({
    label: formatDate(e.date),
    planned: timeToDecimal(e.planned_bedtime) ?? undefined,
    actual: timeToDecimal(e.actual_bedtime) ?? undefined,
  }));

  const allValues = data.flatMap(d => [d.planned, d.actual]).filter((v): v is number => v != null);
  const minVal = Math.floor(Math.min(...allValues)) - 0.25;
  const maxVal = Math.ceil(Math.max(...allValues)) + 0.25;
  const ticks: number[] = [];
  for (let v = Math.ceil(minVal * 2) / 2; v <= maxVal; v += 0.5) ticks.push(v);

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-base font-medium text-gray-400 mb-4 px-1">Trend</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
          <YAxis domain={[minVal, maxVal]} ticks={ticks} tick={<TimeTick />} tickLine={false} width={62} />
          <Tooltip content={<TimeTooltip />} />
          <Legend formatter={(v) => <span style={{ color: '#d1d5db', fontSize: 12 }}>{v}</span>} />
          <Line type="monotone" dataKey="planned" name="Planned" stroke="#818cf8" strokeWidth={2} dot={{ fill: '#818cf8', r: 3 }} connectNulls />
          <Line type="monotone" dataKey="actual" name="Actual" stroke="#c084fc" strokeWidth={2} dot={{ fill: '#c084fc', r: 3 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
