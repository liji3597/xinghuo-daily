import { useRef, useState } from 'react';
import { BookOpen, Check, Download, FileJson, Pencil, ShieldCheck, Trash2, X } from 'lucide-react';
import type { ReadingRecord } from '../types';
import { downloadFile, quoteForRecord, recordsToMarkdown, sortRecords } from '../lib/records';
import type { RecordMap } from '../lib/records';
import { formatShortDate, toLocalDateKey } from '../lib/date';

interface HistoryPageProps {
  records: RecordMap;
  onUpdateThought: (date: string, thought: string) => void;
  onDelete: (date: string) => void;
  onClear: () => void;
  onGoToday: () => void;
}

export function HistoryPage({ records, onUpdateThought, onDelete, onClear, onGoToday }: HistoryPageProps) {
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const clearDialog = useRef<HTMLDialogElement>(null);
  const sorted = sortRecords(records);

  function startEdit(record: ReadingRecord) {
    setEditingDate(record.date);
    setEditValue(record.thought);
  }

  function saveEdit() {
    if (editingDate) onUpdateThought(editingDate, editValue.trim());
    setEditingDate(null);
  }

  function exportJson() {
    downloadFile(JSON.stringify({ product: '星火日签', version: 1, exportedAt: new Date().toISOString(), records: sorted }, null, 2), `星火日签-${toLocalDateKey()}.json`, 'application/json;charset=utf-8');
  }

  function exportMarkdown() {
    downloadFile(recordsToMarkdown(records), `星火日签-${toLocalDateKey()}.md`, 'text/markdown;charset=utf-8');
  }

  return (
    <main id="main-content" className="history-page">
      <header className="page-heading history-heading">
        <div>
          <p className="eyebrow">阅 读 留 痕</p>
          <h1>我的记录</h1>
          <p>每一次阅读，以及那一刻真实的想法。</p>
        </div>
        <span className="record-total">共 {sorted.length} 条</span>
      </header>

      <section className="data-tools" aria-labelledby="data-title">
        <div className="data-assurance">
          <ShieldCheck size={22} aria-hidden="true" />
          <div><h2 id="data-title">你的思考只属于你</h2><p>记录仅保存于当前浏览器，不上传服务器，也不需要注册账号。</p></div>
        </div>
        <div className="export-actions">
          <button className="button button-secondary" type="button" onClick={exportMarkdown} disabled={!sorted.length}><Download size={16} aria-hidden="true" />导出 Markdown</button>
          <button className="icon-text-button" type="button" onClick={exportJson} disabled={!sorted.length}><FileJson size={16} aria-hidden="true" />导出 JSON</button>
        </div>
      </section>

      {sorted.length === 0 ? (
        <section className="empty-history">
          <BookOpen size={32} strokeWidth={1.2} aria-hidden="true" />
          <h2>第一条记录，从今天的一段话开始</h2>
          <p>翻开今日一签后，阅读日期会出现在这里；写下思考，也会一起保存。</p>
          <button className="button button-primary" type="button" onClick={onGoToday}>去读今日一签</button>
        </section>
      ) : (
        <section className="record-list" aria-label="阅读记录列表">
          {sorted.map((record) => {
            const quote = quoteForRecord(record);
            if (!quote) return null;
            const editing = editingDate === record.date;
            return (
              <article className="record-item" key={record.date}>
                <time dateTime={record.date}><strong>{record.date.slice(-2)}</strong><span>{formatShortDate(record.date).split('月')[0]}月 · {record.date.slice(0, 4)}</span></time>
                <div className="record-content">
                  <h2>{quote.text}</h2>
                  <p className="record-source">《{quote.work}》 · {quote.volume}</p>
                  {editing ? (
                    <div className="history-editor">
                      <label className="sr-only" htmlFor={`edit-${record.date}`}>编辑 {record.date} 的思考</label>
                      <textarea id={`edit-${record.date}`} value={editValue} onChange={(event) => setEditValue(event.target.value)} maxLength={500} rows={4} autoFocus />
                      <div><button className="button button-primary small" type="button" onClick={saveEdit}><Check size={15} />保存修改</button><button className="icon-text-button" type="button" onClick={() => setEditingDate(null)}><X size={15} />取消编辑</button></div>
                    </div>
                  ) : (
                    <p className={record.thought ? 'record-thought' : 'record-thought empty'}>{record.thought || '这一天只阅读，未写思考。'}</p>
                  )}
                </div>
                {!editing && <div className="record-actions">
                  <button type="button" onClick={() => startEdit(record)} aria-label={`编辑 ${record.date} 的思考`}><Pencil size={16} /></button>
                  <button type="button" onClick={() => onDelete(record.date)} aria-label={`删除 ${record.date} 的记录`}><Trash2 size={16} /></button>
                </div>}
              </article>
            );
          })}
        </section>
      )}

      {sorted.length > 0 && <button className="clear-records" type="button" onClick={() => clearDialog.current?.showModal()}>清空本机记录</button>}
      <dialog ref={clearDialog} className="confirm-dialog" aria-labelledby="clear-title">
        <h2 id="clear-title">清空全部 {sorted.length} 条记录？</h2>
        <p>此操作无法撤销。建议先导出备份，再继续清空。</p>
        <div><button className="button button-secondary" type="button" onClick={() => clearDialog.current?.close()}>保留记录</button><button className="button button-danger" type="button" onClick={() => { onClear(); clearDialog.current?.close(); }}>清空全部记录</button></div>
      </dialog>
    </main>
  );
}
