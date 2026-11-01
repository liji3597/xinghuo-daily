import { describe, expect, it } from 'vitest';
import { calculateStreak, recordsToMarkdown, sortRecords, type RecordMap } from './records';
import { quotes } from '../data/quotes';
import type { ReadingRecord } from '../types';

function record(date: string, thought = ''): ReadingRecord {
  return {
    date,
    quoteId: quotes[0].id,
    thought,
    revealedAt: `${date}T08:00:00.000Z`,
    updatedAt: `${date}T08:00:00.000Z`,
  };
}

function mapFor(...dates: string[]): RecordMap {
  return Object.fromEntries(dates.map((date) => [date, record(date)]));
}

describe('阅读记录', () => {
  it('按日期从新到旧排序', () => {
    expect(sortRecords(mapFor('2026-10-30', '2026-11-01', '2026-10-31')).map((item) => item.date))
      .toEqual(['2026-11-01', '2026-10-31', '2026-10-30']);
  });

  it('连续阅读包含今天，也能从今天尚未阅读时的昨天开始', () => {
    const records = mapFor('2026-10-29', '2026-10-30', '2026-10-31');
    expect(calculateStreak(records, '2026-10-31')).toBe(3);
    expect(calculateStreak(records, '2026-11-01')).toBe(3);
    expect(calculateStreak(records, '2026-11-02')).toBe(0);
    expect(calculateStreak({}, '2026-11-01')).toBe(0);
  });

  it('导出含原文、出处与思考，并跳过已经失效的语录引用', () => {
    const records = mapFor('2026-10-31');
    records['2026-11-01'] = { ...record('2026-11-01', '先调查，再行动。') };
    records['2026-11-02'] = { ...record('2026-11-02'), quoteId: 'missing-quote' };
    const markdown = recordsToMarkdown(records);
    expect(markdown).toContain('# 星火日签 · 我的阅读记录');
    expect(markdown).toContain('## 2026-11-01');
    expect(markdown).toContain(`> ${quotes[0].text}`);
    expect(markdown).toContain(`《${quotes[0].work}》`);
    expect(markdown).toContain('**我的思考**\n\n先调查，再行动。');
    expect(markdown).toContain('*这一天只阅读，未写思考。*');
    expect(markdown).not.toContain('2026-11-02');
  });
});
