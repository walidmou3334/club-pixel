import { ClubContact } from './ClubContact';
import { useAuth } from '../services/auth';
import { useEffect, useRef, useState } from 'react';
import { PixelLogo } from './Logo';
import { GradBtn } from './ui';

type Page = string;

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: 'home',        label: 'Home'        },
  { id: 'about',       label: 'About'       },
  { id: 'games',       label: 'Games'       },
  { id: 'events',      label: 'Events'      },
  { id: 'tournaments', label: 'Tournaments' },
  { id: 'gallery',     label: 'Gallery'     },
  { id: 'team',        label: 'Team'        },
];

export function Layout({ page, setPage, children }: {
  page: Page; setPage: (p: Page) => void; children: React.ReactNode;
}) {
  const {user,logout}=useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menuOpen]);
  const isAdmin = page.startsWith('admin');

  if (isAdmin) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(16,7,28,0.85)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        {/* Logo */}
        <button onClick={() => { setPage('home'); setMenuOpen(false); }} className="flex items-center gap-3 cursor-pointer">
          <PixelLogo size={36} />
          <div>
            <p className="text-sm font-bold tracking-widest leading-none grad-text">PIXEL</p>
            <p className="text-[9px] tracking-widest mt-0.5 font-medium" style={{ color: 'var(--muted-foreground)' }}>
              STUDENT CLUB
            </p>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ color: page === l.id ? '#f72585' : 'var(--secondary-foreground)' }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="hidden xl:flex items-center gap-3">
          <button
            onClick={() => setPage('discord')}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ color: '#a7a7b5', border: '1px solid var(--border)' }}
          >
            Discord
          </button>
          <button onClick={()=>setPage(user?'profile':'auth')} className="text-sm px-3 py-2">{user?'My Pixel':'Login'}</button>
          {user?.role==='ADMIN'&&<button onClick={()=>setPage('admin')} className="text-sm px-3 py-2">Admin</button>}
          <GradBtn sm onClick={() => setPage('join')}>Join Pixel</GradBtn>
        </div>

        {/* Hamburger */}
        <button ref={menuButton} className="xl:hidden p-2 rounded-lg" style={{ color: 'var(--muted-foreground)' }}
          aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen
              ? <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></>
              : <><line x1="2" y1="5" x2="18" y2="5" /><line x1="2" y1="10" x2="18" y2="10" /><line x1="2" y1="15" x2="18" y2="15" /></>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden fixed inset-0 z-40 pt-20 overflow-y-auto overscroll-contain"
          style={{ background: 'rgba(16,7,28,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col gap-2 p-6">
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }}
                className="py-3 px-4 rounded-xl text-left font-medium text-lg transition-all"
                style={{ color: page === l.id ? '#f72585' : '#fff', background: page === l.id ? 'rgba(247,37,133,0.08)' : 'transparent' }}>
                {l.label}
              </button>
            ))}
            <button className="py-3 text-left" onClick={()=>{setPage(user?'profile':'auth');setMenuOpen(false);}}>{user?'My Pixel':'Login'}</button>
            {user?.role==='ADMIN'&&<button className="py-3 text-left" onClick={()=>{setPage('admin');setMenuOpen(false);}}>Admin</button>}
            <div className="mt-4 flex flex-col gap-3">
              <button onClick={() => { setPage('discord'); setMenuOpen(false); }}
                className="py-3 px-4 rounded-xl font-semibold text-sm"
                style={{ border: '1px solid var(--border)', color: '#fff' }}>
                Discord
              </button>
              <GradBtn onClick={() => { setPage('join'); setMenuOpen(false); }} className="w-full text-center">
                Join Pixel
              </GradBtn>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-10 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <PixelLogo size={28} />
          <span className="font-bold tracking-widest text-sm grad-text">PIXEL</span>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Student Gaming & Entertainment Club
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {['home','about','games','events','team'].map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="text-xs capitalize transition-colors hover:text-white"
              style={{ color: 'var(--muted-foreground)' }}>
              {p}
            </button>
          ))}
        </div>
        <ClubContact compact />
        <p className="text-xs mt-6" style={{ color: '#3a3a4a' }}>
          "Every player is a piece of Pixel." · PIXEL © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
