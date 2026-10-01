import { PixelIcon } from '../components/PixelIcon';
import { useData, eventCard, type ClubEvent, type Registration } from '../services/data';
import { DataState, Feedback } from '../components/States';
import { useAuth } from '../services/auth';
import { apiRequest } from '../services/api';
import { useState } from 'react';
import { GradBtn, Card, Badge, EmptyState } from '../components/ui';


export function EventsPage({ setPage }: { setPage: (p: string) => void }) {
  const resource=useData<ClubEvent[]>('/events'), archive=useData<ClubEvent[]>('/events/archive');
  const {user}=useAuth();const mine=useData<Registration[]>(user?'/events/my-registrations':null);
  const id=Number(window.location.hash.split('/')[2]);
  const detail=useData<ClubEvent>(id?`/events/${id}`:null);
  const all=[...(resource.data||[]),...(archive.data||[])].map(eventCard);
  const selected=all.find(e=>e.id===id)||(detail.data?eventCard(detail.data):null);
  const EVENTS=all.filter(e=>e.status==='PUBLISHED'&&new Date(e.eventDate+'T23:59:59')>=new Date());
  const past=all.filter(e=>e.status==='COMPLETED'||new Date(e.eventDate+'T23:59:59')<new Date());
  const availability=useData<{remaining:number|null;registered:number}>(selected?`/events/${selected.id}/availability`:null);
  const registered=mine.data?.some(r=>r.eventId===id&&r.status==='REGISTERED');
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
  function setSelected(e:ReturnType<typeof eventCard>|null){setMessage('');setError('');setPage(e?`events/${e.id}`:'events');}
  async function register(){if(!user){setPage('auth');return;}if(!selected||busy)return;setBusy(true);setError('');try{await apiRequest(`/events/${selected.id}/register`,{method:registered?'DELETE':'POST'});setMessage(registered?'Your registration has been cancelled.':'You’re in. See you at Pixel!');mine.reload();availability.reload();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  if(id&&!selected)return <div className="p-10 max-w-5xl mx-auto"><DataState loading={detail.loading||resource.loading} error={detail.error||'Event unavailable'} empty={false} retry={detail.reload}/></div>;

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
          style={{ color: 'var(--muted-foreground)' }}>
          ← Back to Events
        </button>
        <div className="rounded-2xl overflow-hidden mb-6 bg-black/20">
          <img src={selected.img}
            alt={selected.title} className="w-full max-h-[75vh] object-contain" />
          
          <div className="p-6">
            <span className="text-4xl block mb-2"><PixelIcon name={selected.icon}/></span>
            <h1 className="text-2xl font-black text-white">{selected.title}</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center"><p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>DATE</p><p className="font-bold">{selected.date}</p></Card>
          <Card className="p-4 text-center"><p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>TIME</p><p className="font-bold">{selected.time}</p></Card>
          <Card className="p-4 text-center"><p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>LOCATION</p><p className="font-bold text-sm">{selected.loc}</p></Card>
        </div>
        <Card className="p-6 mb-6">
          <Badge color={selected.color}>{selected.tag}</Badge>
          <p className="mt-4 leading-relaxed" style={{ color: 'var(--secondary-foreground)' }}>{selected.desc}</p>
          {selected.spots && (
            <p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <PixelIcon name="👥"/> Up to <strong style={{ color: '#fff' }}>{selected.spots} participants</strong>
            </p>
          )}
        </Card>
        <Feedback error={error||mine.error} message={message}/>
        {availability.data?.remaining!=null&&<p className="text-sm text-center text-[var(--muted-foreground)] mb-4">{availability.data.remaining} places remaining</p>}
        <GradBtn disabled={busy||mine.loading||(!registered&&(!selected.registrationOpen||selected.status!=='PUBLISHED'))} onClick={register} className="w-full text-center text-base py-4">{busy?'Please wait…':registered?'Cancel my registration':selected.registrationOpen&&selected.status==='PUBLISHED'?'Register →':'Registration closed'}</GradBtn>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-black grad-text">EVENTS</h1>
        <p className="mt-2 text-base" style={{ color: 'var(--muted-foreground)' }}>What's happening at Pixel.</p>
      </div>

      {/* Upcoming */}
      <h2 className="text-lg font-bold mb-5 tracking-widest" style={{ color: 'var(--secondary-foreground)' }}>UPCOMING EVENTS</h2>
      <DataState {...resource} retry={resource.reload} empty={EVENTS.length===0} title="THE NEXT SESSION IS TAKING SHAPE"><div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {EVENTS.map(ev => (
          <Card key={ev.id}
            className="overflow-hidden cursor-pointer group hover:border-pink-500/30"
            onClick={() => setSelected(ev)}>
            <div className="relative aspect-[905/1280] overflow-hidden bg-black/20">
              <img src={ev.img}
                alt={ev.title} className="w-full h-full object-contain" />
              
              
              
            </div>
            <div className="p-5">
              <p className="font-bold mb-1">{ev.title}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{ev.sub}</p>
              <p className="text-xs font-semibold grad-text">{ev.date}</p>
              {ev.loc && <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}><PixelIcon name="📍"/> {ev.loc}</p>}
              <button className="mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ border: '1px solid var(--border-solid)', color: 'var(--muted-foreground)' }}>
                View Event →
              </button>
            </div>
          </Card>
        ))}
      </div>

      </DataState>
      {/* Past events empty state */}
      <h2 className="text-lg font-bold mb-5 tracking-widest" style={{ color: 'var(--secondary-foreground)' }}>PAST EVENTS</h2>
      <DataState {...archive} retry={archive.reload} empty={past.length===0} emptyContent={<EmptyState icon="📅" title="No past events yet" sub="Future completed events will be archived here." cta="Suggest an Activity" onCta={()=>setPage('suggestions')}/>} title="THE STORY IS JUST BEGINNING"><div className="grid grid-cols-1 sm:grid-cols-3 gap-5">{past.map(e=><Card key={e.id} onClick={()=>setSelected(e)} className="overflow-hidden"><img src={e.img} alt={e.title} className="h-40 w-full object-cover"/><div className="p-5"><h3 className="font-bold">{e.title}</h3><p className="grad-text text-xs mt-3">{e.date}</p></div></Card>)}</div></DataState>
    </div>
  );
}
