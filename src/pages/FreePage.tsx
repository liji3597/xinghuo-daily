import { Shuffle } from 'lucide-react';
import { QuoteCard } from '../components/QuoteCard';
import { quotes } from '../data/quotes';
import type { Quote } from '../types';

interface FreePageProps {
  quote: Quote;
  onDraw: () => void;
}

export function FreePage({ quote, onDraw }: FreePageProps) {
  return (
    <main id="main-content" className="free-page">
      <header className="page-heading">
        <p className="eyebrow">随 机 阅 读</p>
        <h1>此刻，读一段。</h1>
        <p>自由抽取不会改变今日一签，也不做吉凶运势解读。</p>
      </header>
      <section className="free-draw" aria-live="polite">
        <QuoteCard key={quote.id} quote={quote} revealed free />
      </section>
      <button className="button button-primary draw-again" type="button" onClick={onDraw}>
        <Shuffle size={17} aria-hidden="true" /> 再抽一张
      </button>
      <p className="free-count">从 {quotes.length} 条精选语录中随机抽取</p>
    </main>
  );
}
