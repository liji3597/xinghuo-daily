import { describe, expect, it } from 'vitest';
import { formatFullDate, getDailyQuote, getDayOfYear, shiftDate, toLocalDateKey } from './date';
import { quotes } from '../data/quotes';

describe('日期与每日抽签', () => {
  it('按本地日历格式化日期，不依赖 UTC 日期', () => {
    expect(toLocalDateKey(new Date(2026, 0, 2, 23, 59))).toBe('2026-01-02');
    expect(toLocalDateKey(new Date(2026, 10, 1, 0, 1))).toBe('2026-11-01');
  });

  it('同一天始终抽到同一条，跨日索引始终合法', () => {
    for (let day = 1; day <= 365; day += 1) {
      const date = `2026-${String(Math.floor((day - 1) / 28) + 1).padStart(2, '0')}-${String(((day - 1) % 28) + 1).padStart(2, '0')}`;
      const first = getDailyQuote(date, quotes);
      expect(first).toBe(getDailyQuote(date, quotes));
      expect(quotes).toContain(first);
    }
    expect(() => getDailyQuote('2026-11-01', [])).toThrow('语录库不能为空');
  });

  it('正确计算年内天数、跨月日期与中文日期', () => {
    expect(getDayOfYear('2024-12-31')).toBe(366);
    expect(getDayOfYear('2025-12-31')).toBe(365);
    expect(shiftDate('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftDate('2024-02-28', 1)).toBe('2024-02-29');
    expect(formatFullDate('2026-11-01')).toContain('2026');
  });
});
