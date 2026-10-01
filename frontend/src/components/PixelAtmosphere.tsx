import type { CSSProperties } from 'react';

/** Transparent decoration with a quiet center for content and edge-weighted depth. */
export function PixelAtmosphere({ mode = 'page' }: { mode?: 'page' | 'section' }) {
  return <div className={`pixel-atmosphere cosmic-layer cosmic-layer-${mode}`} aria-hidden="true">
    <div className="cosmic-haze" />
    {Array.from({ length: 64 }, (_, i) => {
      const near = i % 6 === 0;
      return <span key={i} className={`cosmic-speck ${near ? 'cosmic-pixel' : 'cosmic-distant'}`} style={{
        left: `${i % 2 === 0 ? 1 + (i * 13.7) % 25 : 75 + (i * 9.3) % 24}%`,
        top: `${(i * 37.3 + 7) % 100}%`,
        width: near ? 5 + i % 5 : 1 + i % 2,
        height: near ? 5 + i % 5 : 1 + i % 2,
        '--cosmic-color': ['#4169FF','#7C3AED','#A855F7','#D946EF','#EC4899'][i % 5],
        animationDuration: `${near ? 18 + i % 9 : 5 + i % 7}s`, animationDelay: `${-i * 1.7}s`,
      } as CSSProperties} />;
    })}
    {[0,1,2,3].map(i => <span key={`trail-${i}`} className="cosmic-shooting-lane" style={{left: `${[0,76,3,82][i]}%`, top: `${[12,34,67,82][i]}%`}}><span className="cosmic-shooting-star" style={{animationDelay:`${[0,4,8,12][i]}s`,animationDuration:'17s'}}/></span>)}
  </div>;
}
