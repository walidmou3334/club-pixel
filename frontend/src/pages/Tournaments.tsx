import { PixelIcon } from '../components/PixelIcon';
import { useState } from 'react';
import { useData, dateLabel, type Tournament, type TournamentRegistration } from '../services/data';
import { DataState, Feedback } from '../components/States';
import { useAuth } from '../services/auth';
import { apiRequest } from '../services/api';
import { GradBtn, Card, StatusBadge, EmptyState } from '../components/ui';


export function TournamentsPage({ setPage }: { setPage: (p: string) => void }) {
  const resource=useData<Tournament[]>('/tournaments'),archive=useData<Tournament[]>('/tournaments/archive');
  const {user}=useAuth();const mine=useData<TournamentRegistration[]>(user?'/tournaments/my-registrations':null);
  const [busy,setBusy]=useState<number|null>(null),[message,setMessage]=useState(''),[error,setError]=useState('');
  const UPCOMING=(resource.data||[]).map(t=>({...t,icon:'🏆',game:t.gameName,date:dateLabel(t.startDate),desc:t.description,status:(t.registrationOpen?'Open':'Closed') as 'Open'|'Closed'}));
  async function register(id:number,cancel:boolean){if(!user){setPage('auth');return;}setBusy(id);setError('');try{await apiRequest(`/tournaments/${id}/register`,{method:cancel?'DELETE':'POST'});setMessage(cancel?'Registration cancelled.':'Registration confirmed.');mine.reload();}catch(e){setError((e as Error).message);}finally{setBusy(null);}}
  return (
    <div className="py-20 px-6 max-w-5xl mx-auto">
      <div className="mb-14">
        <h1 className="text-3xl sm:text-5xl font-black grad-text">TOURNAMENTS</h1>
        <p className="mt-2 text-base" style={{ color: 'var(--muted-foreground)' }}>
          Friendly competitions for every level of player.
        </p>
      </div>

      <Feedback error={error||mine.error} message={message}/>
      {/* Upcoming */}
      <h2 className="text-sm font-bold tracking-widest mb-6" style={{ color: 'var(--secondary-foreground)' }}>UPCOMING TOURNAMENTS</h2>
      <DataState {...resource} retry={resource.reload} empty={UPCOMING.length===0} title="YOUR NEXT CHALLENGE AWAITS"><div className="flex flex-col gap-4 mb-14">
        {UPCOMING.map(t => (
          <Card key={t.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-pink-500/30">
            <span className="text-5xl"><PixelIcon name={t.icon}/></span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="font-black text-xl">{t.title}</h3>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-sm mb-1" style={{ color: 'var(--secondary-foreground)' }}>
                <PixelIcon name="🎮"/> {t.game} · {t.format}
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{t.desc}</p>
              <p className="text-xs font-semibold grad-text"><PixelIcon name="📅"/> {t.date}</p>
            </div>
            <GradBtn disabled={busy!==null||mine.loading||(!t.registrationOpen&&!mine.data?.some(r=>r.tournamentId===t.id&&r.status==='REGISTERED'))} onClick={()=>register(t.id,!!mine.data?.some(r=>r.tournamentId===t.id&&r.status==='REGISTERED'))}>{busy===t.id?'Please wait…':mine.data?.some(r=>r.tournamentId===t.id&&r.status==='REGISTERED')?'Cancel registration':t.registrationOpen?'Register →':'Registration closed'}</GradBtn>
          </Card>
        ))}
      </div>

      </DataState>
      {/* Tournament history empty state */}
      <h2 className="text-sm font-bold tracking-widest mb-6" style={{ color: 'var(--secondary-foreground)' }}>TOURNAMENT HISTORY</h2>
      <DataState {...archive} retry={archive.reload} empty={!archive.data?.length} emptyContent={<EmptyState icon="🏆" title="NO TOURNAMENTS YET" sub="Your first Pixel competition could start here." cta="Suggest a Tournament" onCta={()=>setPage('suggestions')}/>} title="THE FIRST CHAPTER IS STILL TO COME"><div className="grid sm:grid-cols-2 gap-5">{archive.data?.map(t=><Card key={t.id} className="p-6"><h3 className="font-bold">{t.title}</h3><p className="text-sm text-[var(--muted-foreground)] mt-2">{t.gameName} · {dateLabel(t.startDate)}</p></Card>)}</div></DataState>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14">
        {[
          { emoji: '🎮', title: 'All Skill Levels', desc: 'Pixel tournaments are friendly. No experience required.' },
          { emoji: '🤝', title: 'Join the Competition', desc: 'Register individually and meet other players at the club.' },
          { emoji: '💡', title: 'Suggest a Format', desc: 'Have a tournament idea? Share it with us.' },
        ].map(c => (
          <Card key={c.title} className="p-5 text-center">
            <span className="text-3xl block mb-3"><PixelIcon name={c.emoji}/></span>
            <p className="font-bold text-sm mb-2">{c.title}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
