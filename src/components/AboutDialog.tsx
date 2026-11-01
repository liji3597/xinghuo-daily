import { X } from 'lucide-react';
import { quotes } from '../data/quotes';

interface AboutDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}

export function AboutDialog({ dialogRef }: AboutDialogProps) {
  return (
    <dialog ref={dialogRef} className="about-dialog" aria-labelledby="about-title">
      <button className="dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="关闭关于此站"><X size={20} /></button>
      <p className="eyebrow">ABOUT XINGHUO</p>
      <h2 id="about-title">每天一段话，<br />今天就去实践。</h2>
      <p>星火日签从《毛泽东选集》中精选有现实启发的段落，保留卷次、篇名与原文语境。这里不做占卜，也不把复杂的思想剪成空泛口号。</p>
      <h3>你的记录如何保存</h3>
      <p>无需注册，阅读记录与思考仅保存在当前浏览器的本地存储中，不会发送到服务器。更换设备或清理浏览器数据前，请在“我的记录”中导出备份。</p>
      <h3>内容说明</h3>
      <p>当前收录 {quotes.length} 条语录，覆盖《毛泽东选集》第一至第五卷。“今日提示”“历史语境”“当下意义”和“理解边界”属于编辑导读，不是原文内容；每条均可通过来源链接继续核对。</p>
      <button className="button button-primary" type="button" onClick={() => dialogRef.current?.close()}>继续阅读</button>
    </dialog>
  );
}
