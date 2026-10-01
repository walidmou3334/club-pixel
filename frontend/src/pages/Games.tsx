import { GameArtwork } from '../components/GameArtwork';
import { PixelIcon } from '../components/PixelIcon';
import { useData, gameCard, type Game } from '../services/data';
import { DataState, Modal, Feedback } from '../components/States';
import { useAuth } from '../services/auth';
import { apiRequest } from '../services/api';
import { useState } from 'react';
import { GradBtn, Card, Badge, SectionTitle } from '../components/ui';


export function GamesPage({ setPage }: { setPage: (p: string) => void }) {
  const resource=useData<Game[]>('/games');
  const GAMES=(resource.data||[]).map(gameCard);
  const [selected,setSelected]=useState<ReturnType<typeof gameCard>|null>(null);
  const [message,setMessage]=useState(''),[error,setError]=useState(''),[saving,setSaving]=useState(false);
  const {user}=useAuth();
  async function favorite(id:number){if(!user){setPage('auth');return;}setSaving(true);setError('');try{await apiRequest(`/users/me/favorite-games/${id}`,{method:'PUT'});setMessage('Added to your games.');}catch(e){setError((e as Error).message);}finally{setSaving(false);}}
  const [filter, setFilter] = useState<'ALL'|'ONLINE'|'BOARD'>('ALL');
  const shown = GAMES.filter(g => filter === 'ALL' || g.cat === filter);

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <SectionTitle sub="Everything Pixel plays — online and on the table.">
        <span className="grad-text">WHAT DO WE PLAY?</span>
      </SectionTitle><div className="flex flex-wrap justify-between items-center gap-3 mb-7"><p className="text-sm text-[var(--muted-foreground)]">Your next favourite could start with a suggestion.</p><GradBtn outline sm onClick={()=>setPage('suggestions')}>Suggest a Game</GradBtn></div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 p-1 rounded-xl w-fit" style={{ background: 'var(--card)' }}>
        {(['ALL','ONLINE','BOARD'] as const).map(f => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: filter === f ? 'var(--grad)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--muted-foreground)',
            }}>
            {f === 'BOARD' ? 'BOARD GAMES' : f === 'ONLINE' ? 'ONLINE GAMES' : f}
          </button>
        ))}
      </div>

      <DataState {...resource} retry={resource.reload} empty={shown.length===0} title="YOUR NEXT GAME IS ON ITS WAY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {shown.map(g => (
          <Card key={g.id} className="game-tile overflow-hidden group flex flex-col h-full hover:border-pink-500/30">
            <GameArtwork src={g.img} name={g.name}/>
            <div className="p-5 flex flex-col flex-1"><h3 className="font-bold text-xl mb-3">{g.name}</h3>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <Badge color={g.color}>{g.genre}</Badge>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}><PixelIcon name="👥"/> {g.players}</span>
              </div>
              <p className="text-sm leading-relaxed mt-2 mb-5 line-clamp-3" style={{ color: 'var(--muted-foreground)' }}>{g.desc}</p>
              <button onClick={()=>setSelected(g)} className="mt-auto w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: g.color + '22', color: g.color, border: `1px solid ${g.color}44` }}>
                Discover →
              </button>
            </div>
          </Card>
        ))}
      </div>

      </DataState>
      {selected&&<Modal title={selected.name} onClose={()=>{setSelected(null);setMessage('');setError('');}}><GameArtwork src={selected.img} name={selected.name} detail/><Badge>{selected.genre}</Badge><p className="my-5 text-[var(--muted-foreground)]">{selected.desc}</p><Feedback error={error} message={message}/><GradBtn disabled={saving} onClick={()=>favorite(selected.id)}>{saving?'Saving…':'♡ Add to My Games'}</GradBtn></Modal>}
      {/* Suggest CTA */}
      <div className="rounded-2xl p-10 text-center" style={{ border: '1px dashed #2a2a4a', background: 'var(--card)' }}>
        <p className="text-2xl mb-3"><PixelIcon name="💡"/></p>
        <h3 className="font-bold text-lg mb-2">Don't see your game?</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Help us grow the Pixel library. Suggest any game you'd like to play with the club.
        </p>
        <GradBtn onClick={() => setPage('suggestions')}>Suggest a Game</GradBtn>
      </div>
    </div>
  );
}
