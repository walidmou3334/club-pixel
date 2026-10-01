import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiRequest } from './api';
export interface Profile { id:number; name:string; email:string; role:'MEMBER'|'ADMIN'; program:string|null; interests:string[] }
const Context=createContext<{user:Profile|null;loading:boolean;refresh:()=>Promise<Profile|null>;logout:()=>void}>({user:null,loading:true,refresh:async()=>null,logout:()=>{}});
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<Profile|null>(null),[loading,setLoading]=useState(true);
 function logout(){localStorage.removeItem('token');localStorage.removeItem('user');setUser(null);}
 async function refresh(){if(!localStorage.getItem('token')){setUser(null);setLoading(false);return null;}setLoading(true);try{const profile=await apiRequest<Profile>('/users/me');setUser(profile);return profile;}catch(e){logout();throw e;}finally{setLoading(false);}}
 useEffect(()=>{void refresh().catch(()=>{});window.addEventListener('pixel-session-expired',logout);return()=>window.removeEventListener('pixel-session-expired',logout);},[]);
 return <Context.Provider value={{user,loading,refresh,logout}}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
