import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({ message, actionLabel, onAction }: ToastProps) {
  return (
    <div className="toast" role="status">
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{message}</span>
      {actionLabel && <button type="button" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
