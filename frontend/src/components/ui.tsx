import { PixelIcon } from './PixelIcon';
import React, { useId } from 'react';

export function Card({ children, className = '', style = {}, onClick }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <div
      className={`pixel-card rounded-2xl border border-[var(--border)] transition-all duration-200 ${className}`}
      style={{ background: 'var(--card)', ...style }}
      onClick={onClick}
      role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => {if(onClick && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {e.preventDefault();onClick();}}}
    >
      {children}
    </div>
  );
}

export function GradBtn({ children, onClick, className = '', outline = false, sm = false, disabled = false, type = 'button' }: {
  children: React.ReactNode; onClick?: () => void; className?: string; outline?: boolean; sm?: boolean; disabled?:boolean; type?:"button"|"submit"|"reset";
}) {
  const base = sm ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-sm';
  if (outline) {
    return (
      <button
        onClick={onClick} disabled={disabled} type={type}
        className={`${base} rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 active:scale-95 ${className}`}
        style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick} disabled={disabled} type={type}
      className={`${base} rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 grad-bg ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, color = '#f72585' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: color + '22', color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl sm:text-4xl font-bold">{children}</h2>
      {sub && <p className="mt-2 text-base" style={{ color: 'var(--secondary-foreground)' }}>{sub}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, sub, cta, onCta }: {
  icon: string; title: string; sub: string; cta?: string; onCta?: () => void;
}) {
  return (
    <div className="text-center py-20 px-6 rounded-2xl" style={{ border: '1px dashed var(--border-solid)' }}>
      <p className="text-5xl mb-4"><PixelIcon name={icon}/></p>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
      {cta && <GradBtn onClick={onCta}>{cta}</GradBtn>}
    </div>
  );
}

export function Input({ label, placeholder, type = 'text', value, onChange }: {
  label: string; placeholder?: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--secondary-foreground)' }}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'var(--muted)', border: '1px solid var(--border-solid)',
          color: '#fff', fontFamily: 'inherit',
        }}
        onFocus={e => (e.target.style.borderColor = '#f72585')}
        onBlur={e => (e.target.style.borderColor = 'var(--border-solid)')}
      />
    </div>
  );
}

export function Textarea({ label, placeholder, value, onChange }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--secondary-foreground)' }}>{label}</label>
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
        style={{
          background: 'var(--muted)', border: '1px solid var(--border-solid)',
          color: '#fff', fontFamily: 'inherit',
        }}
        onFocus={e => (e.target.style.borderColor = '#f72585')}
        onBlur={e => (e.target.style.borderColor = 'var(--border-solid)')}
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: 'Open' | 'Closed' | 'Soon' | 'TBA' | 'Pending' | 'Accepted' | 'Rejected' | 'Review' }) {
  const map: Record<string, { bg: string; color: string }> = {
    Open:     { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
    Closed:   { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
    Soon:     { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
    TBA:      { bg: 'rgba(167,167,181,0.12)', color: '#a7a7b5' },
    Pending:  { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
    Accepted: { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
    Rejected: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
    Review:   { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa' },
  };
  const s = map[status] ?? map.TBA;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {status}
    </span>
  );
}
