import { ArrowRight, LockKeyhole } from 'lucide-react';
import { QuoteCard } from '../components/QuoteCard';
import { ThoughtEditor } from '../components/ThoughtEditor';
import type { Quote, ReadingRecord } from '../types';
import { formatFullDate, getDayOfYear } from '../lib/date';

interface TodayPageProps {
  dateKey: string;
  quote: Quote;
  record?: ReadingRecord;
  streak: number;
  draft: string;
  onDraftChange: (value: string) => void;
  onReveal: () => void;
  onSave: () => void;
  onBrowseFree: () => void;
}

export function TodayPage({ dateKey, quote, record, streak, draft, onDraftChange, onReveal, onSave, onBrowseFree }: TodayPageProps) {
  const revealed = Boolean(record);
  return (
    <main id="main-content" className={`today-page ${revealed ? 'today-revealed' : ''}`}>
      {!revealed ? (
        <>
          <section className="today-intro" aria-labelledby="today-title">
            <p className="date-line">{formatFullDate(dateKey)}</p>
            <h1 id="today-title">今天，<br />从一句话开始。</h1>
            <p className="intro-copy">从《毛选》中精选一段话，读懂出处，<br className="desktop-only" />也写下它与你今天的关系。</p>
            <div className="reading-streak" aria-label={`已连续阅读 ${streak} 天`}>
              <span>已连续阅读 {streak} 天</span>
              <div className="streak-marks" aria-hidden="true">
                {Array.from({ length: 7 }, (_, index) => <i key={index} className={index < Math.min(streak, 7) ? 'filled' : ''} />)}
              </div>
            </div>
            <button className="button button-primary reveal-button" type="button" onClick={onReveal}>
              翻开今日一签 <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button className="text-link" type="button" onClick={onBrowseFree}>先自由读一段 <ArrowRight size={14} aria-hidden="true" /></button>
          </section>
          <section className="daily-draw" aria-label="今日纸签">
            <QuoteCard quote={quote} revealed={false} onReveal={onReveal} dayNumber={getDayOfYear(dateKey)} />
            <p>轻触纸签 · 今天始终是同一张</p>
          </section>
        </>
      ) : (
        <>
          <div className="revealed-heading">
            <p className="date-line">今日一签&nbsp;&nbsp;/&nbsp;&nbsp;{dateKey.replaceAll('-', '.')}&nbsp;&nbsp;/&nbsp;&nbsp;第 {getDayOfYear(dateKey)} 天</p>
            <span><LockKeyhole size={13} aria-hidden="true" /> 只记录在这台设备</span>
          </div>
          <section className="revealed-quote" aria-label="今日语录">
            <QuoteCard quote={quote} revealed dayNumber={getDayOfYear(dateKey)} />
          </section>
          <ThoughtEditor value={draft} onChange={onDraftChange} onSave={onSave} saved={Boolean(record?.thought)} />
        </>
      )}
    </main>
  );
}
