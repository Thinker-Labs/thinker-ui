'use client';
import {useSyncExternalStore} from 'react';
const key='thinker-ui-sound';
let ctx:AudioContext|null=null;
function muted(){try{return localStorage.getItem(key)==='off'}catch{return false}}
function subscribe(cb:()=>void){window.addEventListener('thinker-sound-change',cb);return()=>window.removeEventListener('thinker-sound-change',cb)}
export function useSoundMuted(){return useSyncExternalStore(subscribe,muted,()=>false)}
export function setSoundMuted(value:boolean){try{localStorage.setItem(key,value?'off':'on')}catch{}window.dispatchEvent(new Event('thinker-sound-change'))}
/* A quiet, low "tock": a short sine with a slow-ish attack, lowpassed hard so nothing sharp gets through. */
export function playClick(kind:'tap'|'toggle'='tap'){
 if(muted()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const Ctor=window.AudioContext||(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Ctor)return;
 ctx=ctx||new Ctor();if(ctx.state==='suspended')void ctx.resume();
 const t=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
 filter.type='lowpass';filter.frequency.value=700;filter.Q.value=.4;
 osc.type='sine';const f=kind==='toggle'?300:380;osc.frequency.setValueAtTime(f,t);osc.frequency.exponentialRampToValueAtTime(f*.8,t+.09);
 gain.gain.setValueAtTime(0.0001,t);gain.gain.exponentialRampToValueAtTime(.022,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+.11);
 osc.connect(filter).connect(gain).connect(ctx.destination);osc.start(t);osc.stop(t+.12);
}
export function installClickSound(){
 function onDown(e:PointerEvent){if(e.button!==0)return;const el=(e.target as Element|null)?.closest('button,a[href],[role=switch],[role=tab],summary,select,input[type=checkbox],input[type=radio]');if(!el||(el as HTMLButtonElement).disabled||el.getAttribute('aria-disabled')==='true')return;playClick(el.getAttribute('role')==='switch'||el.getAttribute('aria-pressed')!==null?'toggle':'tap')}
 document.addEventListener('pointerdown',onDown,true);return()=>document.removeEventListener('pointerdown',onDown,true);
}
