import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from './api';
export interface Game { id:number; name:string; genre:string|null; players:string|null; category:string; description:string|null; imageUrl:string|null; emoji:string|null; color:string|null; active:boolean }
export interface ClubEvent { id:number; title:string; description:string|null; shortDescription:string|null; eventDate:string; startTime:string|null; endTime:string|null; location:string|null; capacity:number|null; status:string; registrationOpen:boolean; imageUrl:string|null }
export interface Tournament { id:number; title:string; gameId:number; gameName:string; startDate:string|null; format:string|null; description:string|null; location:string|null; maxTeams:number|null; registrationOpen:boolean; status:string }
export interface Photo { id:number; title:string; description:string|null; imageUrl:string; eventDate:string|null; category:string|null }
export interface TeamMember { id:number; name:string; role:string; bio:string|null; imageUrl:string|null; email:string|null; linkedinUrl:string|null; discordUsername:string|null }
export interface Registration { id:number; eventId:number; eventTitle:string; eventDate:string; status:string }
export interface TournamentRegistration { id:number; tournamentId:number; title:string; date:string|null; status:string }
export interface Suggestion { id:number; name:string; type:string; description:string|null; preferredDate:string|null; status:string; createdAt:string }
export function useData<T>(path: string | null) {
  const [data,setData] = useState<T | null>(null), [loading,setLoading] = useState(!!path), [error,setError] = useState(''), [revision,setRevision]=useState(0);
  const reload=useCallback(()=>setRevision(n=>n+1),[]);
  useEffect(()=>{ const controller=new AbortController(); setData(null); setError(''); setLoading(!!path);
    if(path) apiRequest<T>(path,{signal:controller.signal}).then(setData).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Unable to load this content.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[path,revision]);
  return {data,loading,error,reload};
}
export function dateLabel(value:string|null|undefined) { if(!value)return 'Date to be announced'; const d=new Date(value+'T12:00:00'); return Number.isNaN(d.getTime())?'Date to be announced':new Intl.DateTimeFormat('en',{day:'numeric',month:'short',year:'numeric'}).format(d); }
export const art = '/pixel-art.svg';
export function safeImage(value:string|null|undefined) { if(!value)return art; try { const u=new URL(value,window.location.origin); return ['http:','https:'].includes(u.protocol)?u.href:art; }catch{return art;} }
export function gameCard(g:Game) {return {...g,cat:g.category,desc:g.description||'',img:safeImage(g.imageUrl),color:/^#[0-9a-f]{6}$/i.test(g.color||'')?g.color!:'#7209b7',emoji:g.emoji||'🎮'};}
export function eventCard(e:ClubEvent) {return {...e,icon:'🎮',sub:e.shortDescription||'',date:dateLabel(e.eventDate),time:[e.startTime?.slice(0,5),e.endTime?.slice(0,5)].filter(Boolean).join(' – ')||'To be announced',loc:e.location||'Location to be announced',tag:e.status,desc:e.description||'',img:safeImage(e.imageUrl),spots:e.capacity,color:'#4361ee'};}
export function photoCard(p:Photo,i:number) {return {...p,img:safeImage(p.imageUrl),label:p.title,cat:p.category||'',wide:i%3===0,h:i%3===0?'tall':'short'};}
