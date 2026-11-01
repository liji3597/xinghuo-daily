import { ShieldCheck } from 'lucide-react';

interface ThoughtEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saved: boolean;
}

const MAX_LENGTH = 500;

export function ThoughtEditor({ value, onChange, onSave, saved }: ThoughtEditorProps) {
  return (
    <section className="thought-editor" aria-labelledby="thought-title">
      <div className="section-heading">
        <h2 id="thought-title">写下一点思考</h2>
        <p>不必写得多，留下一句真实的话就好。</p>
      </div>
      <label className="sr-only" htmlFor="daily-thought">今天的思考</label>
      <div className="editor-field">
        <textarea
          id="daily-thought"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="这段话，让你想到了什么？"
          rows={6}
        />
        <span className="character-count">{value.length} / {MAX_LENGTH}</span>
      </div>
      <div className="editor-actions">
        <button className="button button-primary" type="button" onClick={onSave} disabled={!value.trim()}>
          {saved ? '更新思考' : '保存思考'}
        </button>
        <span className="draft-note">草稿会随输入自动保存</span>
      </div>
      <p className="privacy-note"><ShieldCheck size={16} aria-hidden="true" />内容只保存于当前浏览器，不会上传到服务器。清理浏览器数据前，请先导出备份。</p>
    </section>
  );
}
