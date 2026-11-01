import type { Quote } from '../types';

// 个性化只调整编辑提示，原文、出处与历史解释始终保留基础版本。
const hintOverrides: Record<string, string> = {
  'investigation-01': '做增长判断前，先看用户、渠道和转化数据。',
  'practice-03': '文案、页面和活动是否有效，用小范围实验亲自验证。',
  'committee-09': '看转化，也看样本量、统计口径和比例。',
  'ten-relations-02': '投放增长，也别透支复购、履约与用户体验。',
};

export function applyQuotePreferences(quote: Quote): Quote {
  const hint = hintOverrides[quote.id];
  return hint ? { ...quote, hint } : quote;
}
