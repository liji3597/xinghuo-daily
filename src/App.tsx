import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppChrome } from './components/AppChrome';
import { AboutDialog } from './components/AboutDialog';
import { Toast } from './components/Toast';
import { TodayPage } from './pages/TodayPage';
import { FreePage } from './pages/FreePage';
import { HistoryPage } from './pages/HistoryPage';
import { quoteById, quotes } from './data/quotes';
import { getDailyQuote, toLocalDateKey } from './lib/date';
import { calculateStreak } from './lib/records';
import type { RecordMap } from './lib/records';
import { usePersistentState } from './hooks/usePersistentState';
import type { ReadingRecord, View } from './types';

const RECORDS_KEY = 'xinghuo:records:v1';
const DRAFTS_KEY = 'xinghuo:drafts:v1';

type DraftMap = Record<string, string>;
type ToastState = { message: string; actionLabel?: string; onAction?: () => void };

function viewFromHash(): View {
  const hash = window.location.hash.slice(1);
  return hash === 'free' || hash === 'history' ? hash : 'today';
}

function randomQuote(excludeId?: string) {
  const pool = quotes.filter((quote) => quote.id !== excludeId);
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return pool[values[0] % pool.length];
}

export default function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [today, setToday] = useState(toLocalDateKey);
  const [records, setRecords, recordsError] = usePersistentState<RecordMap>(RECORDS_KEY, {});
  const [drafts, setDrafts, draftsError] = usePersistentState<DraftMap>(DRAFTS_KEY, {});
  const [freeQuote, setFreeQuote] = useState(() => randomQuote());
  const [toast, setToast] = useState<ToastState | null>(null);
  const aboutDialog = useRef<HTMLDialogElement>(null);
  const dailyQuote = useMemo(() => {
    const recordedQuote = quoteById.get(records[today]?.quoteId ?? '');
    return recordedQuote ?? getDailyQuote(today, quotes);
  }, [today, records]);
  const currentRecord = records[today];

  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = toLocalDateKey();
      setToday((current) => current === next ? current : next);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (recordsError || draftsError) setToast({ message: '浏览器阻止了本地保存，请先导出记录并检查隐私设置。' });
  }, [recordsError, draftsError]);

  const navigate = useCallback((next: View) => {
    const hash = next === 'today' ? '' : `#${next}`;
    if (window.location.hash === hash) setView(next);
    else window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  function revealDaily() {
    if (records[today]) return;
    const now = new Date().toISOString();
    const record: ReadingRecord = { date: today, quoteId: dailyQuote.id, thought: drafts[today] || '', revealedAt: now, updatedAt: now };
    setRecords((current) => ({ ...current, [today]: record }));
  }

  function saveThought() {
    const thought = (drafts[today] || '').trim();
    if (!thought) return;
    const now = new Date().toISOString();
    setRecords((current) => ({
      ...current,
      [today]: current[today]
        ? { ...current[today], thought, updatedAt: now }
        : { date: today, quoteId: dailyQuote.id, thought, revealedAt: now, updatedAt: now },
    }));
    setDrafts((current) => ({ ...current, [today]: thought }));
    setToast({ message: '思考已保存在本机' });
  }

  function updateThought(date: string, thought: string) {
    setRecords((current) => current[date] ? { ...current, [date]: { ...current[date], thought, updatedAt: new Date().toISOString() } } : current);
    if (date === today) setDrafts((current) => ({ ...current, [date]: thought }));
    setToast({ message: thought ? '修改已保存' : '思考已清空，阅读记录仍保留' });
  }

  function deleteRecord(date: string) {
    const removed = records[date];
    if (!removed) return;
    setRecords((current) => {
      const next = { ...current };
      delete next[date];
      return next;
    });
    setToast({
      message: '记录已删除', actionLabel: '撤销', onAction: () => {
        setRecords((current) => ({ ...current, [date]: removed }));
        setToast({ message: '记录已恢复' });
      },
    });
  }

  function clearRecords() {
    setRecords({});
    setDrafts({});
    setToast({ message: '本机记录已清空' });
    if (view === 'today') setFreeQuote(randomQuote());
  }

  return (
    <div className="app-shell">
      <AppChrome view={view} onNavigate={navigate} onAbout={() => aboutDialog.current?.showModal()} />
      {view === 'today' && <TodayPage
        dateKey={today}
        quote={dailyQuote}
        record={currentRecord}
        streak={calculateStreak(records, today)}
        draft={drafts[today] ?? currentRecord?.thought ?? ''}
        onDraftChange={(value) => setDrafts((current) => ({ ...current, [today]: value }))}
        onReveal={revealDaily}
        onSave={saveThought}
        onBrowseFree={() => navigate('free')}
      />}
      {view === 'free' && <FreePage quote={freeQuote} onDraw={() => setFreeQuote((current) => randomQuote(current.id))} />}
      {view === 'history' && <HistoryPage records={records} onUpdateThought={updateThought} onDelete={deleteRecord} onClear={clearRecords} onGoToday={() => navigate('today')} />}
      <footer className="site-footer">
        <span>语录均标注卷次与篇名 · 不做吉凶运势解读</span>
        <button type="button" onClick={() => aboutDialog.current?.showModal()}>关于此站</button>
      </footer>
      <AboutDialog dialogRef={aboutDialog} />
      {toast && <Toast message={toast.message} actionLabel={toast.actionLabel} onAction={toast.onAction} />}
    </div>
  );
}
