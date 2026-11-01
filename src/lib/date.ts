import type { Quote } from '../types';

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFullDate(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  }).format(date);
}

export function formatShortDate(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`);
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(date);
}

export function getDayOfYear(dateKey: string): number {
  const date = new Date(`${dateKey}T12:00:00`);
  const start = new Date(date.getFullYear(), 0, 1, 12);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000) + 1;
}

function hashDate(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getDailyQuote(dateKey: string, allQuotes: Quote[]): Quote {
  if (allQuotes.length === 0) throw new Error('语录库不能为空');
  return allQuotes[hashDate(dateKey) % allQuotes.length];
}

export function shiftDate(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
}
