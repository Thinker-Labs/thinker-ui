'use client';
import {usePathname} from 'next/navigation';
import {installClickSound,useSoundMuted,setSoundMuted} from './sound';
import {useEffect,useSyncExternalStore} from 'react';
const key='thinker-ui-theme';
function snapshot(){return document.documentElement.dataset.thinkerTheme==='light';}
function subscribe(callback:()=>void){window.addEventListener('thinker-theme-change',callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener('thinker-theme-change',callback);window.removeEventListener('storage',callback)}}
export function useThinkerTheme(){
 const light=useSyncExternalStore(subscribe,snapshot,()=>false);
 function setLight(value:boolean,from?:Element|null){const apply=()=>{document.documentElement.dataset.thinkerTheme=value?'light':'dark';try{localStorage.setItem(key,value?'light':'dark')}catch{}window.dispatchEvent(new Event('thinker-theme-change'));};const root=document.documentElement;const rect=from?.getBoundingClientRect();const x=rect?rect.left+rect.width/2:innerWidth/2;const y=rect?rect.top+rect.height/2:innerHeight/2;const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));root.style.setProperty('--reveal-x',x+'px');root.style.setProperty('--reveal-y',y+'px');root.style.setProperty('--reveal-r',Math.ceil(r)+'px');if(document.startViewTransition&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.startViewTransition(apply)}else apply();}
 return {light,setLight};
}
export function ThemeButton(){const{light,setLight}=useThinkerTheme();return <button type="button" aria-label="Toggle page theme" aria-pressed={light} onClick={e=>setLight(!light,e.currentTarget)} style={{border:0,borderRadius:25,padding:'11px 16px',minHeight:42,background:'var(--ui-control,#30302e)',color:'inherit',cursor:'pointer',fontSize:12}}><span aria-hidden="true">{light?'☾':'☀'}</span> Theme</button>}

export function ThemeRuntime(){const pathname=usePathname();const inComponents=!!pathname&&pathname.startsWith('/thinker-ui/components');useEffect(()=>{if(!inComponents)return;return installClickSound()},[inComponents]);useEffect(()=>{function apply(){let value:string|null=null;try{value=localStorage.getItem(key)}catch{}document.documentElement.dataset.thinkerTheme=value==='light'||value==='dark'?value:window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';window.dispatchEvent(new Event('thinker-theme-change'))}apply();const media=window.matchMedia('(prefers-color-scheme: light)');media.addEventListener('change',apply);window.addEventListener('storage',apply);return()=>{media.removeEventListener('change',apply);window.removeEventListener('storage',apply)}},[]);return null;}

export function SoundToggle({compact=false}:{compact?:boolean}){const muted=useSoundMuted();return <button type="button" aria-label="Click sounds" aria-pressed={!muted} onClick={()=>setSoundMuted(!muted)} style={{border:0,borderRadius:25,padding:compact?'8px 10px':'11px 16px',minHeight:compact?36:42,background:compact?'transparent':'var(--ui-control,#30302e)',color:'inherit',cursor:'pointer',fontSize:12,font:'inherit'}}><span aria-hidden="true">{muted?'♪̸':'♪'}</span> {muted?'Sound off':'Sound on'}</button>}
