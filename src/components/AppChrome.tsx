import { BookOpen, Home, LockKeyhole, Shuffle } from 'lucide-react';
import { Brand } from './Brand';
import type { View } from '../types';

interface ChromeProps {
  view: View;
  onNavigate: (view: View) => void;
  onAbout: () => void;
}

const items: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'today', label: '今日一签', icon: Home },
  { id: 'free', label: '自由抽取', icon: Shuffle },
  { id: 'history', label: '我的记录', icon: BookOpen },
];

export function AppChrome({ view, onNavigate, onAbout }: ChromeProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="主导航">
          {items.map((item) => <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)} aria-current={view === item.id ? 'page' : undefined}>{item.label}</button>)}
        </nav>
        <button className="local-indicator" type="button" onClick={onAbout}><LockKeyhole size={14} aria-hidden="true" /><span>思考仅保存在本机</span></button>
      </header>
      <nav className="mobile-nav" aria-label="主导航">
        {items.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)} aria-current={view === item.id ? 'page' : undefined}><Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{item.id === 'today' ? '今日' : item.id === 'free' ? '自由' : '记录'}</span></button>;
        })}
      </nav>
    </>
  );
}
