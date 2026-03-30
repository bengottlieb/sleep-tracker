export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  planned_bedtime: string | null; // HH:MM:SS from Postgres
  actual_bedtime: string | null;
  created_at: string;
  updated_at: string;
}
