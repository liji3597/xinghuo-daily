import { describe, expect, it } from 'vitest';
import { quoteById, quotes } from './quotes';

describe('语录库', () => {
  it('包含 100 条 ID 唯一的语录', () => {
    expect(quotes).toHaveLength(100);
    expect(new Set(quotes.map((quote) => quote.id)).size).toBe(quotes.length);
    expect(quoteById.size).toBe(quotes.length);
  });

  it.each(quotes)('$id 具备完整内容与合法来源地址', (quote) => {
    for (const value of [quote.id, quote.text, quote.volume, quote.work, quote.year, quote.hint, quote.context, quote.sourceUrl]) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
    expect(() => new URL(quote.sourceUrl)).not.toThrow();
    expect(['http:', 'https:']).toContain(new URL(quote.sourceUrl).protocol);
    expect(quoteById.get(quote.id)).toBe(quote);
  });
});
