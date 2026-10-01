import { useData, safeImage, type TeamMember } from '../services/data';
import { DataState } from '../components/States';
import { Card } from '../components/ui';

export function TeamPage({ embedded = false }: { embedded?: boolean }) {
  const resource = useData<TeamMember[]>('/team');
  const Heading = embedded ? 'h2' : 'h1';
  return <div className="py-20 px-6 max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <Heading className="text-3xl sm:text-5xl font-black grad-text mb-3">MEET THE PIXEL TEAM</Heading>
      <p className="text-base text-[var(--muted-foreground)]">The people building Pixel, one game at a time.</p>
    </div>
    <DataState {...resource} retry={resource.reload} empty={resource.data?.length===0} title="THE PEOPLE BEHIND THE PLAY">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(resource.data || []).map(m => <Card key={m.id} className="overflow-hidden flex flex-col hover:-translate-y-1 hover:border-pink-500/40 transition-all duration-300">
          {m.imageUrl ? <img src={safeImage(m.imageUrl)} alt={`${m.name} — ${m.role}`} loading="lazy" decoding="async" className="w-full aspect-[590/1004] object-contain bg-black/10"/> : <div className="aspect-[590/1004] flex items-center justify-center text-5xl grad-text">{m.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>}
          <div className="p-5 text-center flex-1">
            <h3 className="font-bold text-lg">{m.name}</h3><p className="text-sm text-pink-400 mt-1">{m.role}</p>
            {m.bio && <p className="text-sm text-[var(--muted-foreground)] mt-3">{m.bio}</p>}
            <div className="flex justify-center gap-4 mt-3 text-sm">{m.email && <a href={`mailto:${m.email}`} className="text-pink-400">Email</a>}{m.linkedinUrl && /^https?:\/\//.test(m.linkedinUrl) && <a href={m.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400">LinkedIn</a>}</div>
          </div>
        </Card>)}
      </div>
    </DataState>
    {embedded ? <div className="text-center mt-8"><a href="#/team" className="inline-block px-6 py-3 rounded-xl border border-purple-500/30 hover:border-pink-400 transition-colors">Meet the Team →</a></div> : <a href="#/join" className="block mt-10 p-8 rounded-2xl text-center border border-dashed border-white/15 hover:border-pink-500/40 transition-colors"><p className="font-bold">Your next chapter starts at Pixel</p><p className="text-sm mt-2 grad-text">Join the community →</p></a>}
  </div>;
}
