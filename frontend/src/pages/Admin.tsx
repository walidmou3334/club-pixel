import { PixelIcon } from '../components/PixelIcon';
import { useAuth } from '../services/auth';
import { useState } from 'react';
import { PixelLogo } from '../components/Logo';
import { Card, GradBtn, Badge } from '../components/ui';
import { DataState, Feedback, Modal } from '../components/States';
import {
 apiRequest,
 apiDownload,
 uploadImage,
 ApiError,
} from '../services/api';
import { useData } from '../services/data';
type Row = Record<string, unknown> & {id:number};
type Field={key:string;label:string;type?:string;required?:boolean;options?:string[]};
const NAV=[['dashboard','📊','Dashboard'],['games','🎮','Games'],['events','📅','Events'],['tournaments','🏆','Tournaments'],['gallery','📸','Gallery'],['team','✦','Team'],['membership-applications','📨','Applications'],['suggestions','💡','Suggestions'],['users','👥','Members']];
const status:Field={key:'status',label:'Publication status',options:['DRAFT','PUBLISHED','COMPLETED','CANCELLED']};
const description:Field={key:'description',label:'Description',type:'textarea'};
const image:Field={
 key:'imageUrl',
 label:'Image',
 type:'image'
};
const FIELDS:Record<string,Field[]>={
 games:[{key:'name',label:'Name',required:true},{key:'genre',label:'Genre'},{key:'players',label:'Players / format'},{key:'category',label:'Category',options:['ONLINE','BOARD','CARD','CASUAL'],required:true},description,image,{key:'emoji',label:'Emoji'},{key:'color',label:'Accent color',type:'color'}],
 events:[{key:'title',label:'Title',required:true},{...description,required:true},{key:'shortDescription',label:'Short description'},{key:'eventDate',label:'Event date',type:'date',required:true},{key:'startTime',label:'Start time',type:'time'},{key:'endTime',label:'End time',type:'time'},{key:'location',label:'Location'},{key:'capacity',label:'Capacity (optional)',type:'number'},image,status,{key:'registrationOpen',label:'Registration open',type:'checkbox'}],
 tournaments:[{key:'title',label:'Title',required:true},{key:'gameId',label:'Game',type:'game',required:true},{key:'startDate',label:'Date',type:'date'},{key:'format',label:'Format'},description,{key:'location',label:'Location'},{key:'maxTeams',label:'Registration capacity (individual sign-ups in V1)',type:'number'},status,{key:'registrationOpen',label:'Registration open',type:'checkbox'}],
 gallery:[{key:'title',label:'Title',required:true},description,{...image,required:true},{key:'eventDate',label:'Date',type:'date'},{key:'category',label:'Category',options:['','GAMING','BOARD','EVENTS','COMMUNITY']}],
 team:[{key:'name',label:'Name',required:true},{key:'role',label:'Club position',required:true},{key:'bio',label:'Bio',type:'textarea'},image,{key:'email',label:'Email',type:'email'},{key:'linkedinUrl',label:'LinkedIn URL',type:'url'},{key:'discordUsername',label:'Discord username'},{key:'displayOrder',label:'Display order',type:'number'}]
};
const control='w-full rounded-xl bg-[var(--muted)] border border-white/10 px-4 py-3 text-sm outline-none focus:border-pink-500 transition-colors';
function Dashboard(){const r=useData<Record<string,number>>('/admin/dashboard');return <><h1 className="text-2xl font-black mb-2">WELCOME BACK ✦</h1><p className="text-sm text-[var(--muted-foreground)] mb-8">Your community. Your next chapter.</p><DataState {...r} retry={r.reload} empty={false}><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[['totalUsers','Members','👥'],['totalEvents','Events','📅'],['totalEventRegistrations','Event registrations','📝'],['totalMembershipApplications','Applications','📨'],['totalSuggestions','Suggestions','💡'],['totalGames','Games','🎮'],['totalTournaments','Tournaments','🏆']].map(([key,label,icon])=><Card key={key} className="p-5"><span className="text-2xl"><PixelIcon name={icon}/></span><p className="text-3xl font-black mt-4 mb-1 grad-text">{r.data?.[key]??'—'}</p><p className="text-xs tracking-wider text-[var(--muted-foreground)]">{label.toUpperCase()}</p></Card>)}</div></DataState></>;}
function Content({section}:{section:string}){
 const r=useData<Row[]>(`/admin/${section}`),games=useData<Row[]>(section==='tournaments'?'/admin/games':null);
 const [search,setSearch]=useState(''),[editing,setEditing]=useState<Row|null>(null),[form,setForm]=useState<Record<string,unknown>>({}),[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState(''),[confirm,setConfirm]=useState<Row|null>(null),[participants,setParticipants]=useState<number|null>(null);
 const participantsData=useData<Row[]>(participants?`/admin/${section}/${participants}/registrations`:null);
 const fields=FIELDS[section];
 const rows=(r.data||[]).filter(row=>[row.name,row.title,row.firstName,row.lastName,row.email,row.program].some(v=>String(v??'').toLowerCase().includes(search.toLowerCase())));
 function edit(row?:Row){setError('');const defaults:Record<string,unknown>={};fields?.forEach(f=>defaults[f.key]=f.type==='checkbox'?true:f.type==='color'?'#7209b7':f.options?.[0]??'');setForm({...defaults,...row});setEditing(row||{id:0});}
 async function mutate(path:string,method:string,body?:unknown){if(busy)return;setBusy(true);setError('');setMessage('');try{await apiRequest(path,{method,...(body!==undefined?{body:JSON.stringify(body)}:{})});r.reload();setEditing(null);setConfirm(null);setMessage('Saved. The website now reflects your update.');}catch(e){setError(e instanceof ApiError?[e.message,...Object.values(e.fields)].join(' · '):(e as Error).message);}finally{setBusy(false);}}
 async function uploadSelectedImage(file: File) {
  if (busy) return;

  setBusy(true);
  setError('');
  setMessage('');

  try {
   const result = await uploadImage(file);

   setForm(current => ({
    ...current,
    imageUrl: result.url,
   }));

   setMessage('Image uploaded. Click Save changes.');
  } catch (e) {
   setError(
       e instanceof ApiError
           ? e.message
           : (e as Error).message
   );
  } finally {
   setBusy(false);
  }
 }
 function save(){const payload:Record<string,unknown>={};fields.forEach(f=>{let v=form[f.key];if(f.type==='number'||f.type==='game')v=v===''||v==null?null:Number(v);else if(v==='')v=null;payload[f.key]=v;});void mutate(`/${section}${editing?.id?'/'+editing.id:''}`,editing?.id?'PUT':'POST',payload);}
 const title=NAV.find(n=>n[0]===section)?.[2]||section;
 return <><div className="flex flex-wrap items-center justify-between gap-4 mb-8"><div><p className="text-xs tracking-[.25em] text-pink-400 mb-2">PIXEL / BACK OFFICE</p><h1 className="text-2xl font-black">{title.toUpperCase()}</h1></div>{fields&&<GradBtn onClick={()=>edit()}>+ Create {section==='gallery'?'photo':section==='team'?'team member':section.slice(0,-1)}</GradBtn>}</div>
 <label htmlFor="admin-search" className="sr-only">Search {title}</label><input id="admin-search" className={`${control} mb-6`} placeholder={`Search ${title.toLowerCase()}…`} value={search} onChange={e=>setSearch(e.target.value)}/><Feedback error={error} message={message}/>
 <DataState {...r} retry={r.reload} empty={rows.length===0} title={`NO ${title.toUpperCase()} TO SHOW`}><div className="space-y-4">{rows.map(row=><Card key={row.id} className="p-5 sm:p-6"><div className="flex flex-wrap justify-between items-start gap-5"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h2 className="font-bold text-lg break-words">{String(row.title||row.name||[row.firstName,row.lastName].filter(Boolean).join(' '))}</h2>{(row.status||typeof row.active==='boolean'||typeof row.enabled==='boolean')&&<Badge>{String(row.status??(row.active??row.enabled?'ACTIVE':'INACTIVE'))}</Badge>}</div>{row.email!=null&&<p className="text-sm text-[var(--muted-foreground)] break-all mt-2">{String(row.email)}</p>}{row.program!=null&&<p className="text-sm text-[var(--muted-foreground)] mt-2">{String(row.program)}</p>}{!!(row.description||row.motivation||row.bio)&&<p className="text-sm text-[var(--muted-foreground)] mt-3 whitespace-pre-wrap break-words">{String(row.description||row.motivation||row.bio)}</p>}{Array.isArray(row.interests)&&<div className="flex flex-wrap gap-2 mt-3">{row.interests.map(i=><Badge key={String(i)}>{String(i)}</Badge>)}</div>}{row.type!=null&&<p className="text-xs text-pink-300 mt-3">{String(row.type)}</p>}</div><div className="flex flex-wrap gap-2">
 {fields&&<GradBtn sm outline onClick={()=>edit(row)}>Edit</GradBtn>}
 {['events','tournaments'].includes(section)&&<GradBtn sm outline onClick={()=>setParticipants(row.id)}>Participants</GradBtn>}
 {fields&&<button disabled={busy} className="text-xs px-3 py-2 text-rose-300" onClick={()=>setConfirm(row)}>{['events','tournaments'].includes(section)?'Cancel activity':row.active===false?'Reactivate':'Deactivate'}</button>}
 {section==='membership-applications'&&['PENDING','ACCEPTED','REJECTED'].filter(s=>s!==row.status).map(s=><button disabled={busy} key={s} className="rounded-lg px-3 py-2 text-xs bg-white/5 hover:bg-pink-500/15" onClick={()=>mutate(`/admin/membership-applications/${row.id}/status`,'PATCH',{status:s})}>{s}</button>)}
 {section==='suggestions'&&['PENDING','REVIEWED','ACCEPTED','REJECTED'].filter(s=>s!==row.status).map(s=><button disabled={busy} key={s} className="rounded-lg px-3 py-2 text-xs bg-white/5 hover:bg-pink-500/15" onClick={()=>mutate(`/admin/suggestions/${row.id}/status`,'PATCH',{status:s})}>{s}</button>)}
 {section==='users'&&row.role!=='ADMIN'&&<button disabled={busy} className="text-xs px-3 py-2 text-rose-300" onClick={()=>setConfirm(row)}>{row.enabled?'Disable account':'Enable account'}</button>}
 </div></div></Card>)}</div></DataState>
  {editing && (
      <Modal
          title={`${editing.id ? 'EDIT' : 'CREATE'} ${title.toUpperCase()}`}
          onClose={() => {
           if (!busy) setEditing(null);
          }}
      >
       <form
           className="grid sm:grid-cols-2 gap-5"
           onSubmit={e => {
            e.preventDefault();
            save();
           }}
       >
        {fields.map(f => (
            <div
                key={f.key}
                className={
                 f.type === 'textarea' ||
                 f.type === 'url' ||
                 f.type === 'image'
                     ? 'sm:col-span-2'
                     : ''
                }
            >
             <label
                 htmlFor={'field-' + f.key}
                 className="block text-sm text-[var(--secondary-foreground)] mb-2"
             >
              {f.label}
              {f.required ? ' *' : ''}
             </label>

             {f.type === 'checkbox' ? (
                 <input
                     id={'field-' + f.key}
                     type="checkbox"
                     className="accent-pink-500 w-5 h-5"
                     checked={!!form[f.key]}
                     onChange={e =>
                         setForm({
                          ...form,
                          [f.key]: e.target.checked,
                         })
                     }
                 />
             ) : f.options || f.type === 'game' ? (
                 <select
                     id={'field-' + f.key}
                     className={control}
                     required={f.required}
                     value={String(form[f.key] ?? '')}
                     onChange={e =>
                         setForm({
                          ...form,
                          [f.key]: e.target.value,
                         })
                     }
                 >
                  {f.type === 'game' ? (
                      <>
                       <option value="">Choose a game</option>

                       {games.data?.map(g => (
                           <option key={g.id} value={g.id}>
                            {String(g.name)}
                           </option>
                       ))}
                      </>
                  ) : (
                      f.options?.map(o => (
                          <option key={o} value={o}>
                           {o || 'Uncategorized'}
                          </option>
                      ))
                  )}
                 </select>
             ) : f.type === 'image' ? (
                 <>
                  <input
                      id={'field-' + f.key}
                      className={control}
                      type="file"
                      accept="image/*"
                      disabled={busy}
                      required={f.required && !form.imageUrl}
                      onChange={e => {
                       const file = e.currentTarget.files?.[0];

                       if (file) {
                        void uploadSelectedImage(file);
                       }
                      }}
                  />

                  {form.imageUrl && (
                      <img
                          src={String(form.imageUrl)}
                          alt="Preview"
                          className="mt-3 h-32 w-full rounded-xl object-cover"
                      />
                  )}
                 </>
             ) : f.type === 'textarea' || f.type === 'url' ? (
                 <textarea
                     id={'field-' + f.key}
                     className={control}
                     rows={f.type === 'url' ? 3 : 6}
                     placeholder={f.type === 'url' ? 'https://…' : undefined}
                     required={f.required}
                     value={String(form[f.key] ?? '')}
                     onChange={e =>
                         setForm({
                          ...form,
                          [f.key]: e.target.value,
                         })
                     }
                 />
             ) : (
                 <input
                     id={'field-' + f.key}
                     className={control}
                     type={f.type || 'text'}
                     min={
                      f.key === 'displayOrder'
                          ? 0
                          : f.type === 'number'
                              ? 1
                              : undefined
                     }
                     required={f.required}
                     value={String(form[f.key] ?? '')}
                     onChange={e =>
                         setForm({
                          ...form,
                          [f.key]: e.target.value,
                         })
                     }
                 />
             )}
            </div>
        ))}

        <div className="sm:col-span-2">
         <Feedback error={error || games.error} />

         <GradBtn
             type="submit"
             disabled={busy || games.loading}
         >
          {busy ? 'Saving…' : 'Save changes'}
         </GradBtn>
        </div>
       </form>
      </Modal>
  )}
 {confirm&&<Modal title="CONFIRM YOUR CHANGE" onClose={()=>setConfirm(null)}><p className="text-sm text-[var(--muted-foreground)] mb-6">Update the status of <strong className="text-white">{String(confirm.title||confirm.name)}</strong>? Existing records and registration history will be retained.</p><Feedback error={error}/><GradBtn disabled={busy} onClick={()=>{if(section==='users')void mutate(`/admin/users/${confirm.id}/enabled`,'PATCH',{enabled:!confirm.enabled});else if(['events','tournaments'].includes(section))void mutate(`/${section}/${confirm.id}`,'DELETE');else void mutate(`/admin/${section}/${confirm.id}/active`,'PATCH',{active:confirm.active===false});}}>{busy?'Updating…':'Confirm'}</GradBtn></Modal>}
 {participants&&<Modal title="REGISTRATIONS" onClose={()=>setParticipants(null)}>{section==='events'&&<div className="mb-5"><GradBtn disabled={busy||participantsData.loading||!!participantsData.error||!participantsData.data?.some(p=>p.status==='REGISTERED')} onClick={async()=>{setBusy(true);setError('');try{await apiDownload(`/admin/events/${participants}/registrations.csv`,`pixel-event-${participants}-participants.csv`);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>{busy?'Exporting…':'Export participants CSV'}</GradBtn><p className="text-xs text-[var(--muted-foreground)] mt-3">Confirmed registrations only. Cancelled registrations are excluded.</p><Feedback error={error}/></div>}<DataState {...participantsData} retry={participantsData.reload} empty={!participantsData.data?.length} title="NO REGISTRATIONS YET">{participantsData.data?.map(p=><div key={String(p.registrationId??p.id)} className="py-4 border-b border-white/10"><p className="font-semibold">{String(p.name||p.userName||'Participant')}</p><p className="text-sm text-[var(--muted-foreground)] break-all">{String(p.email||p.userEmail||'')}</p><Badge>{String(p.status)}</Badge></div>)}</DataState></Modal>}
 </>;
}
export function AdminPage({setPage}:{setPage:(page:string)=>void}){
 const {logout}=useAuth();
 const [section,setSection]=useState('dashboard'),[open,setOpen]=useState(false);
 return <div className="pixel-admin min-h-screen md:h-screen flex flex-col md:flex-row bg-[var(--background)]"><header className="md:hidden flex justify-between p-4 bg-[var(--card)]"><button onClick={()=>setPage('home')}><PixelLogo size={32}/></button><button aria-expanded={open} onClick={()=>setOpen(!open)}>Admin menu ☰</button></header><aside className={`${open?'flex':'hidden'} md:flex w-full md:w-56 shrink-0 flex-col bg-[var(--card)] border-r border-white/5`}><div className="hidden md:flex items-center gap-3 px-4 py-5 border-b border-white/5"><PixelLogo size={30}/><div><p className="text-xs font-black tracking-widest grad-text">PIXEL</p><p className="text-[9px] tracking-widest text-[var(--muted-foreground)]">ADMIN</p></div></div><nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">{NAV.map(([id,icon,label])=><button key={id} onClick={()=>{setSection(id);setOpen(false);}} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${section===id?'bg-pink-500/10 text-pink-400 border-l-2 border-pink-500':'text-[var(--secondary-foreground)] hover:bg-white/5'}`}><span><PixelIcon name={icon}/></span>{label}</button>)}</nav><button className="m-3 p-3 rounded-xl text-xs bg-[var(--muted)]" onClick={()=>setPage('home')}>← Back to Website</button><button className="mx-3 mb-3 p-3 rounded-xl text-xs border border-white/10" onClick={()=>{logout();setPage('admin');}}>Sign out</button></aside><main className="flex-1 overflow-y-auto p-8"><div className="max-w-6xl mx-auto">{section==='dashboard'?<Dashboard/>:<Content key={section} section={section}/>}</div></main></div>;
}
