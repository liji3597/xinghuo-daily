import type { Quote, ReadingRecord } from '../types';
import { quoteById } from '../data/quotes';
import { shiftDate, toLocalDateKey } from './date';

export type RecordMap = Record<string, ReadingRecord>;

export function sortRecords(records: RecordMap): ReadingRecord[] {
  return Object.values(records).sort((a, b) => b.date.localeCompare(a.date));
}

export function calculateStreak(records: RecordMap, today = toLocalDateKey()): number {
  let cursor = records[today] ? today : shiftDate(today, -1);
  let streak = 0;
  while (records[cursor]) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

export function recordsToMarkdown(records: RecordMap): string {
  const lines = ['# 星火日签 · 我的阅读记录', ''];
  for (const record of sortRecords(records)) {
    const quote = quoteById.get(record.quoteId);
    if (!quote) continue;
    lines.push(`## ${record.date}`, '', `> ${quote.text}`, '', `——《毛泽东选集》${quote.volume}《${quote.work}》`, '');
    lines.push('**历史语境**', '', quote.historicalContext, '', '**当下意义**', '', quote.todayMeaning, '', '**理解边界**', '', quote.boundary, '');
    lines.push(record.thought ? `**我的思考**\n\n${record.thought}` : '*这一天只阅读，未写思考。*', '');
  }
  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function quoteForRecord(record: ReadingRecord): Quote | undefined {
  return quoteById.get(record.quoteId);
}
