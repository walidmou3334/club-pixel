import { PixelIcon } from '../components/PixelIcon';
import { apiRequest, ApiError } from '../services/api';
import { Feedback } from '../components/States';
import { useState } from 'react';
import { GradBtn, Input, Textarea, Card } from '../components/ui';

const INTERESTS = ['Gaming', 'Esports', 'Board Games', 'Casual Games', 'Community', 'Events'];

export function JoinPage({ setPage }: { setPage: (p: string) => void }) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(){if(busy)return;setBusy(true);setError('');try{await apiRequest('/membership-applications',{method:'POST',body:JSON.stringify({...form,interests})});setStep(3);}catch(e){setError(e instanceof ApiError?[e.message,...Object.values(e.fields)].join(' · '):(e as Error).message);}finally{setBusy(false);}}
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', program: '', motivation: '' });
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (i: string) =>
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  if (step === 3) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-lg animate-fadeup">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full grad-bg flex items-center justify-center text-4xl"><PixelIcon name="🎮" tone="light"/></div>
          </div>
          <h1 className="text-4xl font-black mb-2 grad-text">APPLICATION SENT</h1>
          <p className="text-xl font-semibold mb-3">Your application is now with the Pixel team.</p>
          <p className="text-base mb-10" style={{ color: 'var(--muted-foreground)' }}>
            Hey {form.firstName || 'Player'}! Thank you for your interest. Your application is pending review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GradBtn onClick={() => setPage('discord')} className="text-base px-8 py-3">Join Discord</GradBtn>
            <GradBtn outline onClick={() => setPage('games')} className="text-base px-8 py-3">Explore Games</GradBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-black grad-text mb-3">BECOME PART OF PIXEL</h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          Whether you love competitive games, casual games, board games or simply want to meet new people,
          there is a place for you at Pixel.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: step >= s ? 'var(--grad)' : 'var(--card)',
                color: step >= s ? '#fff' : 'var(--muted-foreground)',
                border: step >= s ? 'none' : '1px solid var(--border-solid)',
              }}>
              {s}
            </div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: step === s ? '#fff' : 'var(--muted-foreground)' }}>
              {s === 1 ? 'Your Info' : 'Your Interests'}
            </span>
            {s < 2 && <div className="w-12 h-0.5 rounded-full" style={{ background: step > s ? 'var(--grad)' : 'var(--border-solid)' }} />}
          </div>
        ))}
      </div>

      <Feedback error={error}/><Card className="p-8">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-bold text-lg mb-2">Your Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Nadia" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} />
              <Input label="Last Name" placeholder="Osei" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} />
            </div>
            <Input label="Student Email" type="email" placeholder="you@university.edu" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
            <Input label="Class / Program" placeholder="e.g. Computer Science, Year 2" value={form.program} onChange={v => setForm(f => ({ ...f, program: v }))} />
            <GradBtn onClick={() => {if(!form.firstName.trim()||!form.lastName.trim()||!form.email.includes('@')){setError('Please enter your name and a valid email.');return;}setError('');setStep(2);}} className="w-full text-center py-4 text-base mt-2">
              Continue →
            </GradBtn>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-bold text-lg mb-2">Your Interests</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>What do you want to do at Pixel? Select all that apply.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTERESTS.map(i => (
                <button key={i} onClick={() => toggleInterest(i)}
                  className="py-3 px-4 rounded-xl text-sm font-semibold transition-all text-center"
                  style={{
                    background: interests.includes(i) ? 'rgba(247,37,133,0.15)' : 'var(--muted)',
                    border: interests.includes(i) ? '1px solid rgba(247,37,133,0.5)' : '1px solid var(--border-solid)',
                    color: interests.includes(i) ? '#f72585' : 'var(--muted-foreground)',
                  }}>
                  {interests.includes(i) && <span className="mr-1">✓</span>}{i}
                </button>
              ))}
            </div>
            <Textarea label="Motivation (optional)" value={form.motivation} onChange={v=>setForm(f=>({...f,motivation:v}))}/><div className="flex gap-3 mt-2">
              <GradBtn outline onClick={() => setStep(1)} className="px-6">← Back</GradBtn>
              <GradBtn disabled={busy} onClick={submit} className="flex-1 text-center py-3 text-base">
                {busy?'Sending…':'Send application →'}
              </GradBtn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
