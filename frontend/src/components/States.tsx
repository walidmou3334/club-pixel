import { useEffect, useRef, type ReactNode } from 'react';
import { Card, EmptyState, GradBtn } from './ui';
export function DataState({loading,error,empty,retry,title='The next chapter starts here',children,compact=false,emptyContent}:{emptyContent?:ReactNode;compact?:boolean;loading:boolean;error:string;empty:boolean;retry:()=>void;title?:string;children?:ReactNode}) {
 if(compact) {
  if(loading)return <div role="status" aria-label="Loading" className="space-y-3 py-3"><div className="skeleton h-4 rounded w-3/4"/><div className="skeleton h-3 rounded w-1/2"/></div>;
  if(error)return <div className="py-3"><p role="alert" className="text-sm text-rose-300 mb-3 break-words">{error}</p><GradBtn sm outline onClick={retry}>Try again</GradBtn></div>;
  if(empty)return <p className="text-sm py-2 text-[var(--muted-foreground)]">{title.charAt(0)+title.slice(1).toLowerCase()}.</p>;
  return <>{children}</>;
 }
 if(loading)return <div role="status" aria-label="Loading" className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">{[0,1,2].map(i=><Card key={i} className="p-6 overflow-hidden"><div className="skeleton h-28 rounded-xl mb-5"/><div className="skeleton h-4 rounded w-3/4 mb-3"/><div className="skeleton h-3 rounded w-1/2"/></Card>)}</div>;
 if(error)return <Card className="p-8 my-8 text-center"><div className="text-3xl mb-4">✦</div><h2 className="text-xl font-bold mb-2">A little pause in play</h2><p role="alert" className="text-sm text-rose-300 mb-5">{error}</p><GradBtn outline onClick={retry}>Try again</GradBtn></Card>;
 if(emptyContent && empty)return <>{emptyContent}</>;
 if(empty)return <div className="my-8"><EmptyState icon="✦" title={title} sub="There’s nothing published here yet. Check back for the next Pixel update."/></div>;
 return <>{children}</>;
}
export function Feedback({error,message}:{error?:string;message?:string}) {return <>{error&&<p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-300 my-4">{error}</p>}{message&&<p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300 my-4">{message}</p>}</>;}
export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement;ref.current?.showModal();return()=>{ref.current?.close();previous?.focus();};},[]);
 return <dialog ref={ref} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}} className="pixel-dialog animate-fadeup" aria-label={title}><div className="p-6 sm:p-8"><div className="flex justify-between gap-4 mb-6"><h2 className="text-xl font-bold grad-text">{title}</h2><button type="button" aria-label="Close dialog" className="shrink-0 w-11 h-11 -mt-2 -mr-2 rounded-xl hover:bg-white/5 transition-colors" onClick={onClose}>✕</button></div>{children}</div></dialog>;
}
