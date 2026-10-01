import { art } from '../services/data';

/** Preserve the entire supplied poster, regardless of its original proportions. */
export function GameArtwork({ src, name, detail = false }: { src: string; name: string; detail?: boolean }) {
  return <div className={`game-artwork ${detail ? 'game-artwork-detail' : ''}`}>
    <img src={src} alt={name} loading="lazy" decoding="async"
      onError={event => { if (!event.currentTarget.src.endsWith(art)) event.currentTarget.src = art; }} />
  </div>;
}
