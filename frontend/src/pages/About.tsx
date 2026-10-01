import { PixelIcon } from '../components/PixelIcon';
import { GradBtn, Card } from '../components/ui';
import { PixelLogo } from '../components/Logo';

const GOALS = [
  { word: 'PLAY',    desc: 'A space for gaming and fun, without barriers.', emoji: '🎮' },
  { word: 'CONNECT', desc: 'Build friendships beyond the classroom.', emoji: '🤝' },
  { word: 'COMPETE', desc: 'Push yourself in a friendly, spirited setting.', emoji: '🏆' },
  { word: 'CREATE',  desc: 'Shape what Pixel becomes, together.', emoji: '✨' },
];

const TIMELINE = [
 {year:'01',label:'FIND YOUR PEOPLE',desc:'Discover the games and activities published by the Pixel team.',active:true},
 {year:'02',label:'MAKE YOUR MOVE',desc:'Join a session, share an idea, or register for a tournament.',active:true},
 {year:'03',label:'CREATE THE NEXT MOMENT',desc:'Bring your energy. Help shape what the club plays next.',active:true},
];

export function AboutPage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 blur-3xl opacity-15 rounded-full" style={{ background: '#7209b7' }} />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 blur-3xl opacity-10 rounded-full" style={{ background: '#4361ee' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-8"><PixelLogo hero /></div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 grad-text">OUR STORY</h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--secondary-foreground)' }}>
            Pixel brings students together in a space dedicated to gaming,
            board games, entertainment and community.
          </p>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            We are a young club that is still growing — discovering who we are, what we love to play,
            and who we want to be. Every new member makes us more complete.
          </p>
        </div>
      </section>

      {/* Goals */}
      <section className="py-20 px-6" style={{ background: 'var(--secondary-bg)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-12">WHAT DRIVES US</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GOALS.map((g, i) => (
              <Card key={g.word} className="p-6 text-center flex flex-col items-center gap-3">
                <span className="text-4xl"><PixelIcon name={g.emoji}/></span>
                <p className="text-xs font-bold tracking-widest grad-text">{g.word}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{g.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-14">YOUR PIXEL JOURNEY</h2>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 opacity-20 grad-bg" />
          <div className="flex flex-col gap-12">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className={`relative flex ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-center gap-8`}>
                {/* dot */}
                <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 grad-bg"
                  style={{ boxShadow: t.active ? '0 0 16px rgba(247,37,133,0.5)' : 'none' }} />
                {/* content */}
                <div className={`ml-20 sm:ml-0 sm:w-5/12 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                  <Card className={`p-5 ${!t.active ? 'opacity-60' : ''}`}>
                    <p className="text-xs font-bold tracking-widest mb-1 grad-text">{t.year}</p>
                    <p className="font-bold mb-2">{t.label}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{t.desc}</p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: 'var(--secondary-bg)' }}>
        <h2 className="text-2xl sm:text-3xl font-black mb-4">BE PART OF WHAT COMES NEXT</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
          Pixel is young. That means you can help shape it.
        </p>
        <div className="flex items-center justify-center gap-4">
          <GradBtn onClick={() => setPage('join')}>Join Pixel</GradBtn>
          <GradBtn outline onClick={() => setPage('suggestions')}>Share an Idea</GradBtn>
        </div>
      </section>
    </div>
  );
}
