import { useId } from 'react';

// Small geometric line icons, with the official PIXEL pink/violet/blue palette.
// API emoji values are mapped here so native multicolour emoji never dictate the UI.
const paths: Record<string, string> = {
  game: 'M7 7h10l3 4 1 6a2 2 0 0 1-3 2l-4-3h-4l-4 3a2 2 0 0 1-3-2l1-6 3-4Z M6 11v4 M4 13h4 M16 12h.01 M18 14h.01',
  dice: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M7 7h.01 M17 7h.01 M12 12h.01 M7 17h.01 M17 17h.01',
  trophy: 'M7 3h10v7a5 5 0 0 1-10 0V3Z M7 5H3v3a4 4 0 0 0 4 4 M17 5h4v3a4 4 0 0 1-4 4 M12 15v6 M8 21h8',
  people: 'M15 21v-2a5 5 0 0 0-10 0v2 M10 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M17 5a4 4 0 0 1 0 7 M18 15a5 5 0 0 1 3 4v2',
  calendar: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M7 3v4 M17 3v4 M3 11h18 M7 15h3 M14 15h3 M7 18h3',
  idea: 'M9 18h6 M10 21h4 M8 15a7 7 0 1 1 8 0l-1 3H9l-1-3Z M12 6v2',
  chat: 'M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 3-2Z M7 9h10 M7 13h6',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M3 16l5-5 5 5 3-3 5 5 M16 7h.01',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z M3 6l9 7 9-7',
  chart: 'M4 3v18h17 M8 16v-4 M13 16V8 M18 16V5',
  note: 'M7 3h10l4 4v14H3V3h4Z M15 3v6h6 M7 13h10 M7 17h7',
  pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  puzzle: 'M3 3h6v3a3 3 0 1 0 6 0V3h6v6h-3a3 3 0 1 0 0 6h3v6h-6v-3a3 3 0 1 0-6 0v3H3v-6h3a3 3 0 1 0 0-6H3V3Z',
};
const aliases: Record<string, string> = { '🎮':'game','🎲':'dice','🏆':'trophy','🤝':'people','👥':'people','📅':'calendar','💡':'idea','💬':'chat','📸':'image','📨':'mail','📊':'chart','📝':'note','📍':'pin','✨':'puzzle','✦':'puzzle' };

export function PixelIcon({ name = 'puzzle', className = '', tone = 'brand' }: { name?: string; className?: string; tone?: 'brand' | 'light' }) {
  const id = `pixel-icon-${useId().replace(/:/g, '')}`;
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="1em" height="1em" className={`inline-block align-[-0.12em] shrink-0 ${className}`} fill="none" stroke={tone === 'light' ? '#fff' : `url(#${id})`} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f72585"/><stop offset=".5" stopColor="#b65cec"/><stop offset="1" stopColor="#4361ee"/></linearGradient></defs>
    <path d={paths[aliases[name] || name] || paths.game}/>
  </svg>;
}
