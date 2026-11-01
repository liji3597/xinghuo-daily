import { describe, expect, it } from 'vitest';
import { quoteById, quotes } from './quotes';
import { applyQuotePreferences } from './user-preferences';

const normalize = (value: string) => value.replace(/[\s\p{P}\p{S}]/gu, '');

describe('语录库', () => {
  it('包含 112 条 ID 与原文均唯一的语录，覆盖第一至第五卷', () => {
    expect(quotes).toHaveLength(112);
    expect(new Set(quotes.map((quote) => quote.id)).size).toBe(quotes.length);
    expect(new Set(quotes.map((quote) => normalize(quote.text))).size).toBe(quotes.length);
    expect(new Set(quotes.map((quote) => quote.volume))).toEqual(new Set(['第一卷', '第二卷', '第三卷', '第四卷', '第五卷']));
    expect(quoteById.size).toBe(quotes.length);
  });

  it.each(quotes)('$id 具备完整三层导读与合法来源地址', (quote) => {
    for (const value of [quote.id, quote.text, quote.volume, quote.work, quote.year, quote.hint, quote.historicalContext, quote.todayMeaning, quote.boundary, quote.sourceUrl]) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
    expect(() => new URL(quote.sourceUrl)).not.toThrow();
    expect(['http:', 'https:']).toContain(new URL(quote.sourceUrl).protocol);
    expect(quoteById.get(quote.id)).toBe(quote);
  });

  it('保留《纪念白求恩》中用于批评自我中心的原文', () => {
    expect(quoteById.get('bethune-02')?.text).toBe('一事当前，先替自己打算，然后再替别人打算。');
    expect(quoteById.get('bethune-02')?.boundary).toContain('批评以自我为中心');
  });

  it('个性化提示不修改基础原文和深度导读', () => {
    const original = quotes.find((quote) => quote.id === 'investigation-01')!;
    const personalized = applyQuotePreferences({ ...original, hint: '未应用' });
    expect(personalized.hint).not.toBe('未应用');
    expect(personalized.text).toBe(original.text);
    expect(personalized.historicalContext).toBe(original.historicalContext);
    expect(personalized.todayMeaning).toBe(original.todayMeaning);
    expect(personalized.boundary).toBe(original.boundary);
  });
});
