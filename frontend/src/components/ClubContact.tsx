import { useId } from 'react';

function SocialLogo({ kind }: { kind: 'instagram' | 'gmail' }) {
  const id = useId();
  return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <defs><linearGradient id={id} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#4169FF"/><stop offset=".5" stopColor="#A855F7"/><stop offset="1" stopColor="#EC4899"/></linearGradient></defs>
    {kind === 'instagram' ? <g stroke={`url(#${id})`} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={`url(#${id})`} stroke="none"/></g> : <path d="M3 19V6l9 7 9-7v13M3 6V5l9 7 9-7v1" stroke={`url(#${id})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
  </svg>;
}

export function ClubContact({ compact = false }: { compact?: boolean }) {
  return <section aria-label="Contact PIXEL" className={compact ? 'mt-6' : 'py-20 px-6 text-center max-w-5xl mx-auto'}>
    {!compact && <><h2 className="text-3xl sm:text-4xl font-black mb-3">LET’S CONNECT</h2><p className="text-[var(--muted-foreground)] mb-7">Follow the club or email us to ask about reserving a place at an event.</p></>}
    <div className="flex flex-wrap items-center justify-center gap-4">
      <a href="https://www.instagram.com/club_pixel_ensas/" target="_blank" rel="noreferrer" aria-label="PIXEL on Instagram" title="@club_pixel_ensas" className="pixel-social-link"><SocialLogo kind="instagram"/></a>
      <a href="mailto:ensasclubpixels@gmail.com" aria-label="Email PIXEL" title="ensasclubpixels@gmail.com" className="pixel-social-link"><SocialLogo kind="gmail"/></a>
      {!compact && <a href="mailto:ensasclubpixels@gmail.com?subject=Event%20reservation%20enquiry" className="grad-bg px-6 py-3 rounded-xl text-sm font-semibold">Ask to Reserve a Place</a>}
    </div>
  </section>;
}
