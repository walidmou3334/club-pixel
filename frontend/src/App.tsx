import { useAuth } from './services/auth';
import { AuthPage } from './pages/Auth';
import { DataState } from './components/States';
import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { GamesPage } from './pages/Games';
import { EventsPage } from './pages/Events';
import { TournamentsPage } from './pages/Tournaments';
import { GalleryPage } from './pages/Gallery';
import { TeamPage } from './pages/Team';
import { SuggestionsPage } from './pages/Suggestions';
import { JoinPage } from './pages/Join';
import { DiscordPage } from './pages/Discord';
import { ProfilePage } from './pages/Profile';
import { AdminPage } from './pages/Admin';

export type Page =
  | 'home' | 'about' | 'games' | 'events' | 'tournaments'
  | 'gallery' | 'team' | 'suggestions' | 'join' | 'discord'
  | 'profile' | 'admin' | 'auth';

export default function App() {
  const {user,loading,logout}=useAuth();
  const [route,setRoute]=useState(()=>window.location.hash.slice(1)||'/home');
  useEffect(()=>{const update=()=>setRoute(window.location.hash.slice(1)||'/home');window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);
  const page=(route.split('/')[1]||'home') as Page;

  // Scroll to top on page change
  const navigate = (p: string) => {
    window.location.hash='/'+p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin has its own layout
  if (page === 'admin' && user?.role === 'ADMIN') {
    return <AdminPage setPage={navigate} />;
  }

  const content: Record<Page, React.ReactNode> = {
    home:        <HomePage setPage={navigate} />,
    about:       <AboutPage setPage={navigate} />,
    games:       <GamesPage setPage={navigate} />,
    events:      <EventsPage setPage={navigate} />,
    tournaments: <TournamentsPage setPage={navigate} />,
    gallery:     <GalleryPage />,
    team:        <TeamPage />,
    suggestions: <SuggestionsPage />,
    join:        <JoinPage setPage={navigate} />,
    discord:     <DiscordPage />,
    profile:     <ProfilePage />,
    admin:       <div className="p-12 text-center"><h1 className="text-2xl font-bold grad-text mb-4">Administrator access required</h1><p className="text-sm text-[var(--muted-foreground)] mb-6">This account does not have administrator permissions.</p><button className="grad-bg rounded-xl px-6 py-3" onClick={()=>logout()}>Sign in with another account</button></div>,
    auth: <AuthPage setPage={navigate} />,
  };

  return (
    <Layout page={page} setPage={navigate}>
      {loading && ['profile','admin'].includes(page) ? <DataState loading error="" empty={false} retry={()=>{}}/> : !user && ['profile','admin'].includes(page) ? <AuthPage setPage={navigate}/> : content[page] || <div className="p-20 text-center"><h1 className="grad-text text-4xl font-bold">Page not found</h1><button onClick={()=>navigate('home')}>Back to Pixel</button></div>}

    </Layout>
  );
}
