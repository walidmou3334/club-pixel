import { TeamPage } from './Team';
import { ClubContact } from '../components/ClubContact';
import { PixelAtmosphere } from '../components/PixelAtmosphere';
import { GamesPage } from './Games';
import { PixelIcon } from '../components/PixelIcon';
import { useData, eventCard, photoCard, type ClubEvent, type Photo } from '../services/data';
import { DataState } from '../components/States';

import { PixelLogo } from '../components/Logo';
import { GradBtn, Card, Badge } from '../components/ui';


const HOW = [
  { n: '01', title: 'JOIN US',           desc: 'Join the PIXEL community.' },
  { n: '02', title: 'CHOOSE YOUR GAME', desc: 'On screen or around the table.' },
  { n: '03', title: 'PLAY',             desc: 'Share a game with other students.' },
  { n: '04', title: 'CONNECT',          desc: 'Meet players who share your passion.' },
  { n: '05', title: 'COME BACK',        desc: 'Discover the next club event.' },
];


const PILLARS = [
  { emoji: '🎮', title: 'VIDEO GAMES',      desc: 'Online games and sessions for every play style.' },
  { emoji: '🎲', title: 'BOARD GAMES', desc: 'The joy of playing together around a table.' },
  { emoji: '🏆', title: 'COMPETITION', desc: 'Friendly challenges and tournaments.' },
  { emoji: '🤝', title: 'COMMUNITY',   desc: 'Students brought together by a shared passion.' },
];


export function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const events=useData<ClubEvent[]>('/events'),gallery=useData<Photo[]>('/gallery');
  const EVENTS=(events.data||[]).filter(e=>new Date(e.eventDate+'T23:59:59')>=new Date()).slice(0,3).map(eventCard);
  const GALLERY_IMGS=(gallery.data||[]).slice(0,6).map(photoCard);


  return (
    <div className="home-atmosphere pixel-cosmic">
      <PixelAtmosphere/>
      {/* ── Hero ── */}
      <section className="cosmic-hero relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ background: '#f72585' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl animate-pulse"
            style={{ background: '#4361ee', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: '#7209b7' }} />
        </div>

        <div className="relative z-10 animate-fadeup">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(247,37,133,0.12)', border: '1px solid rgba(247,37,133,0.3)', color: '#f72585' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            THE STUDENT GAMING CLUB
          </div>
          <h1 aria-label="PIXEL" className="flex justify-center mb-8 animate-float">
            <PixelLogo hero />
          </h1>
          <p className="text-lg sm:text-2xl font-semibold tracking-[0.2em] mb-3"
            style={{ color: 'var(--secondary-foreground)' }}>
            PLAY. CONNECT. CREATE.
          </p>
          <p className="text-base sm:text-lg max-w-lg mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Video games, board game nights and new connections: find your place in the PIXEL universe.
          </p>
          <p className="text-sm italic mb-10" style={{ color: '#5a5a7a' }}>
            Every player is a piece of PIXEL.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GradBtn onClick={() => setPage('join')} className="text-base px-8 py-4">
              Join PIXEL
            </GradBtn>
            <GradBtn outline onClick={() => setPage('events')} className="text-base px-8 py-4">
              Discover Events
            </GradBtn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-0.5 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, #f72585, transparent)' }} />
        </div>
      </section>

      {/* ── What is Pixel ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-black leading-tight">
            ONE CLUB.<br />
            <span className="grad-text">MANY WAYS TO PLAY.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map(p => (
            <Card key={p.title} className="p-6 flex flex-col gap-4 hover:border-pink-500/30 cursor-default">
              <span className="text-4xl"><PixelIcon name={p.emoji}/></span>
              <h3 className="font-bold text-sm tracking-widest" style={{ color: 'var(--secondary-foreground)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6" style={{ background: 'rgba(16,14,29,.48)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black">YOUR PLACE IN PIXEL</h2>
          </div>
          {/* Desktop: horizontal */}
          <div className="hidden sm:flex items-start gap-0">
            {HOW.map((h, i) => (
              <div key={h.n} className="flex-1 relative flex flex-col items-center text-center px-4">
                {/* connector line */}
                {i < HOW.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 grad-bg opacity-30" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full grad-bg flex items-center justify-center text-sm font-bold text-white mb-4 shrink-0">
                  {h.n}
                </div>
                <p className="text-xs font-bold tracking-widest mb-2 grad-text">{h.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{h.desc}</p>
              </div>
            ))}
          </div>
          {/* Mobile: vertical */}
          <div className="sm:hidden flex flex-col gap-6">
            {HOW.map(h => (
              <div key={h.n} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full grad-bg flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {h.n}
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest grad-text mb-1">{h.title}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Explore Pixel games" className="home-game-catalogue">
        <GamesPage setPage={setPage}/>
      </section>

      {/* ── Upcoming ── */}
      <section className="py-20 px-6" style={{ background: 'rgba(16,14,29,.48)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black">UPCOMING EVENTS</h2>
          </div>
          <DataState {...events} retry={events.reload} empty={EVENTS.length===0} title="THE NEXT SESSION IS TAKING SHAPE"/><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {EVENTS.map(ev => (
              <Card key={ev.id} className="overflow-hidden flex flex-col hover:border-pink-500/30 cursor-pointer group"
                onClick={() => setPage(`events/${ev.id}`)}>
                <div className="aspect-[905/1280] w-full bg-black/20 overflow-hidden">
                  <img src={ev.img} alt={ev.title} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-3xl"><PixelIcon name={ev.icon}/></span>
                  <Badge color={ev.tag === 'Online' ? '#4361ee' : ev.tag === 'Tournament' ? '#f72585' : '#7209b7'}>
                    {ev.tag}
                  </Badge>
                </div>
                <div>
                  <p className="font-bold mb-1">{ev.title}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{ev.sub}</p>
                </div>
                <div className="mt-auto">
                  <p className="text-xs font-semibold grad-text">{ev.date}</p>
                  {ev.loc && <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}><PixelIcon name="📍"/> {ev.loc}</p>}
                </div>
                <button className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ border: '1px solid var(--border-solid)', color: 'var(--muted-foreground)' }}>
                  View Event →
                </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Show real memories when available; offer a meaningful invitation otherwise. */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        {GALLERY_IMGS.length > 0 ? <>
          <h2 className="text-center text-3xl sm:text-4xl font-black mb-10">PIXEL MOMENTS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY_IMGS.map(g => <button key={g.id} onClick={()=>setPage('gallery')} aria-label={`Open gallery: ${g.label}`} className="aspect-[4/3] rounded-2xl overflow-hidden group">
              <img src={g.img} alt={g.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </button>)}
          </div>
          <div className="text-center mt-8"><GradBtn outline onClick={()=>setPage('gallery')}>View Gallery →</GradBtn></div>
        </> : <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 px-6 py-12 sm:p-14 text-center" style={{background:'linear-gradient(125deg,rgba(65,105,255,.08),rgba(124,58,237,.12),rgba(236,72,153,.08))'}}>
          <div className="flex justify-center gap-5 mb-7 text-3xl" aria-hidden="true"><PixelIcon name="🎮"/><PixelIcon name="🤝"/><PixelIcon name="🏆"/></div>
          <p className="text-xs tracking-[.2em] font-semibold text-pink-400 mb-4">BE PART OF WHAT’S NEXT</p>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-5">GREAT MEMORIES.<br/><span className="grad-text">START WITH YOU.</span></h2>
          <p className="max-w-lg mx-auto text-[var(--muted-foreground)] mb-8">A new teammate. A close match. A night around the table. Come play, meet the community and help create our next PIXEL moment.</p>
          <div className="flex flex-wrap justify-center gap-4"><GradBtn onClick={()=>setPage('events')}>Find Your Next Event</GradBtn><GradBtn outline onClick={()=>setPage('suggestions')}>Suggest a Game</GradBtn></div>
        </div>}
      </section>

      <section aria-label="Our team"><TeamPage embedded /></section>

      {/* ── Community CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'rgba(16,14,29,.48)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 blur-3xl opacity-20 rounded-full" style={{ background: '#f72585' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 blur-3xl opacity-15 rounded-full" style={{ background: '#4361ee' }} />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black leading-tight mb-6">
            EVERY PLAYER IS<br />
            <span className="grad-text">A PIECE OF PIXEL.</span>
          </h2>
          <p className="text-base mb-10" style={{ color: 'var(--secondary-foreground)' }}>
            PIXEL is built by its community. Join us and shape the next adventure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GradBtn onClick={() => setPage('join')} className="text-base px-8 py-4">Join PIXEL</GradBtn>
            <GradBtn outline onClick={() => setPage('discord')} className="text-base px-8 py-4">Join Discord</GradBtn>
          </div>
        </div>
      </section>
      <ClubContact />
    </div>
  );
}
