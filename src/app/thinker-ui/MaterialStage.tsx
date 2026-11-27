'use client';
import {useState} from 'react';
import {useThinkerTheme} from './ThemeControls';
import {BrandMark} from './BrandMark';
import {Sun,Moon} from 'lucide-react';
import s from './cinema.module.css';
import MistCanvas from './MistCanvas';
/** Original smoke field and one page-wide theme switch. */
export default function MaterialStage(){const{light,setLight}=useThinkerTheme();const[paused,setPaused]=useState(false);return <div className={s.atmosphere} data-paused={paused}><div className={s.mist} aria-hidden="true"><MistCanvas light={light} paused={paused}/></div><div className={s.glassControl}><div className={s.controlIdentity}><BrandMark/><div><span>Theme</span><p>{light?'Light':'Dark'}</p></div></div><div className={s.switchWrap}><Sun size={17} aria-hidden="true"/><button type="button" role="switch" aria-checked={!light} aria-label="Dark appearance" onClick={e=>setLight(!light,e.currentTarget)} className={s.themeSwitch}><span><span aria-hidden="true">{light?<Sun size={18}/>:<Moon size={18}/>}</span></span></button><Moon size={17} aria-hidden="true"/></div></div><div className={s.sceneFootnote}><p>One switch themes the whole page.</p><button type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume mist':'Pause mist'}</button></div></div>}
