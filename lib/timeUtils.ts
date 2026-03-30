// Convert "HH:MM" or "HH:MM:SS" to decimal hours, treating post-midnight as 24+
// e.g. "22:30" → 22.5, "00:30" → 24.5
export function timeToDecimal(time: string | null): number | null {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  const decimal = hours + minutes / 60;
  return decimal < 12 ? decimal + 24 : decimal;
}

// Convert decimal hours back to "H:MM AM/PM" for display
// Works for values ≥ 24 (post-midnight)
export function decimalToTimeLabel(decimal: number): string {
  const normalizedHour = Math.floor(decimal) % 24;
  const minutes = Math.round((decimal % 1) * 60);
  const period = normalizedHour < 12 ? 'AM' : 'PM';
  const displayHour = normalizedHour === 0 ? 12 : normalizedHour > 12 ? normalizedHour - 12 : normalizedHour;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Strip seconds from Postgres time for <input type="time">
export function formatTimeForInput(time: string | null): string {
  if (!time) return '';
  return time.substring(0, 5);
}

// Pretty 12-hour display, e.g. "11:30 PM"
export function formatTimeDisplay(time: string | null): string {
  if (!time) return '—';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// "2025-03-29" → "Sat, Mar 29"
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}
