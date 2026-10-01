import { PixelIcon } from '../components/PixelIcon';
import { apiRequest, ApiError } from '../services/api';
import { Feedback } from '../components/States';
import { useState } from 'react';
import { GradBtn, Input, Textarea, Card } from '../components/ui';

const TYPES = ['Online Game', 'Board Game', 'Tournament', 'Gaming Session', 'Special Event', 'Other'];

export function SuggestionsPage() {
  const [form, setForm] = useState({ name: '', type: '', desc: '', date: '' });
  const [submitted, setSubmitted] = useState(false);

  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const handleSubmit = async () => {
    if(busy)return;
    if(!form.name.trim()||!form.type){setError('Activity name and type are required.');return;}
    setBusy(true);setError('');
    try{await apiRequest('/suggestions',{method:'POST',body:JSON.stringify({name:form.name,type:form.type,description:form.desc,preferredDate:form.date||null})});setSubmitted(true);}catch(e){setError(e instanceof ApiError?[e.message,...Object.values(e.fields)].join(' · '):(e as Error).message);}finally{setBusy(false);}
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fadeup">
          <div className="text-7xl mb-6"><PixelIcon name="🎮"/></div>
          <h1 className="text-3xl font-black mb-3 grad-text">IDEA RECEIVED</h1>
          <p className="text-lg font-semibold mb-2">Thanks for helping build Pixel.</p>
          <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
            We'll review your suggestion and get back to the community.
          </p>
          <GradBtn onClick={() => { setSubmitted(false); setForm({ name: '', type: '', desc: '', date: '' }); }}>
            Submit Another Idea
          </GradBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-black grad-text mb-3">GOT AN IDEA?</h1>
        <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
          Can’t find your game? Tell us what you want to play. Visitors and members are welcome — no account required.
        </p>
      </div>

      <Feedback error={error}/><Card className="p-8">
        <div className="flex flex-col gap-6">
          <Input label="Game / Activity Name" placeholder="e.g. Minecraft Build Battle" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />

          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--secondary-foreground)' }}>Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPES.map(t => (
                <button key={t} aria-pressed={form.type === t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center"
                  style={{
                    background: form.type === t ? 'rgba(247,37,133,0.15)' : 'var(--muted)',
                    border: form.type === t ? '1px solid rgba(247,37,133,0.5)' : '1px solid var(--border-solid)',
                    color: form.type === t ? '#f72585' : 'var(--muted-foreground)',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Textarea label="Description" placeholder="Tell us more about your idea..." value={form.desc} onChange={v => setForm(f => ({ ...f, desc: v }))} />

          <Input label="Preferred Date (optional)" placeholder="e.g. next Friday, any weekend..." type="text" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />

          <GradBtn disabled={busy} onClick={handleSubmit} className="w-full text-center py-4 text-base">
            {busy?'Sending…':'Submit Idea →'}
          </GradBtn>
        </div>
      </Card>
    </div>
  );
}
