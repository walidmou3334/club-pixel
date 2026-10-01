import { useData, photoCard, type Photo } from '../services/data';
import { DataState, Modal } from '../components/States';
import { useState } from 'react';
import { Card } from '../components/ui';


const CATS = ['ALL', 'GAMING', 'BOARD', 'EVENTS', 'COMMUNITY'];

export function GalleryPage() {
  const resource=useData<Photo[]>('/gallery');
  const PHOTOS=(resource.data||[]).map(photoCard);
  const [cat, setCat] = useState('ALL');
  const [lightbox, setLightbox] = useState<typeof PHOTOS[0] | null>(null);
  const shown = PHOTOS.filter(p => cat === 'ALL' || p.cat === cat);

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-5xl font-black grad-text">PIXEL MOMENTS</h1>
        <p className="mt-2 text-base" style={{ color: 'var(--muted-foreground)' }}>Small moments. Big memories.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: cat === c ? 'var(--grad)' : 'var(--card)',
              color: cat === c ? '#fff' : 'var(--muted-foreground)',
              border: '1px solid var(--border)',
            }}>
            {c}
          </button>
        ))}
      </div>

      <DataState {...resource} retry={resource.reload} empty={shown.length===0} title="MEMORIES ARE MADE TOGETHER">
      {/* Masonry grid */}
      <div className="columns-2 sm:columns-3 gap-3 space-y-3">
        {shown.map((p, i) => (
          <div key={p.id} role="button" tabIndex={0} aria-label={`View ${p.label}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setLightbox(p);}}}
            className="relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid"
            onClick={() => setLightbox(p)}>
            <img
              src={p.img}
              alt={p.label}
              style={{ aspectRatio: p.wide ? '3 / 2' : '6 / 5' }}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-sm font-semibold text-white">{p.label}</p>
            </div>
          </div>
        ))}
      </div>

      </DataState>
      {/* Lightbox */}
      {lightbox && <Modal title={lightbox.label} onClose={()=>setLightbox(null)}><img src={lightbox.img} alt={lightbox.label} className="w-full max-h-[65vh] object-contain rounded-2xl"/>{lightbox.description&&<p className="mt-4 text-sm text-[var(--muted-foreground)]">{lightbox.description}</p>}</Modal>}
    </div>
  );
}
