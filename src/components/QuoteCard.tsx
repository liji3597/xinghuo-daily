import { ArrowUpRight, Star } from 'lucide-react';
import type { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  revealed: boolean;
  onReveal?: () => void;
  dayNumber?: number;
  free?: boolean;
}

export function QuoteCard({ quote, revealed, onReveal, dayNumber, free = false }: QuoteCardProps) {
  return (
    <div className={`quote-card-scene ${revealed ? 'is-revealed' : ''} ${free ? 'is-free' : ''}`}>
      <div className="quote-card-inner">
        <button
          className="quote-card-face quote-card-back"
          type="button"
          onClick={onReveal}
          aria-label="翻开今日一签"
          aria-hidden={revealed}
          tabIndex={revealed ? -1 : 0}
        >
          <span className="card-frame" aria-hidden="true">
            <span className="card-english">XING HUO · DAILY</span>
            <span className="card-emblem"><Star strokeWidth={1.2} /></span>
            <span className="card-title">星 火</span>
            <span className="card-motto">每日一读 · 知行合一</span>
            {dayNumber && <span className="card-number">NO. {String(dayNumber).padStart(3, '0')} / 365</span>}
          </span>
        </button>

        <article className="quote-card-face quote-card-front" aria-hidden={!revealed}>
          <div className="quote-label"><span aria-hidden="true" />原文摘录</div>
          <blockquote>{quote.text}</blockquote>
          <p className="quote-source">《毛泽东选集》{quote.volume}<br />《{quote.work}》</p>
          <div className="quote-tip">
            <strong>今日提示</strong>
            <p>{quote.hint}</p>
          </div>
          <details className="quote-context">
            <summary>读懂这句话</summary>
            <div>
              <section>
                <h3>历史语境</h3>
                <p>{quote.historicalContext}</p>
              </section>
              <section>
                <h3>当下意义</h3>
                <p>{quote.todayMeaning}</p>
              </section>
              <section>
                <h3>理解边界</h3>
                <p>{quote.boundary}</p>
              </section>
              <a href={quote.sourceUrl} target="_blank" rel="noreferrer" tabIndex={revealed ? 0 : -1}>
                查看原文来源 <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </details>
        </article>
      </div>
    </div>
  );
}
