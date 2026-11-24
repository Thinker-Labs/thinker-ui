'use client';
import {useRef,useState} from 'react';
import type {CSSProperties,KeyboardEvent,PointerEvent} from 'react';
import {BrandMark} from './BrandMark';
import s from './component-stage.module.css';

const finishes=['Matte','Satin','Gloss'] as const;
const extras=['Rim light','Soft shadow','Inner glow'] as const;
const clamp=(n:number)=>Math.min(100,Math.max(0,Math.round(n)));

/** A tactile bench: one value, six parts, one tile that answers to all of them. */
export default function ComponentStage(){
  const [value,setValue]=useState(62);
  const [finish,setFinish]=useState<(typeof finishes)[number]>('Satin');
  const [on,setOn]=useState<string[]>(['Rim light','Soft shadow']);
  const dial=useRef<HTMLDivElement>(null);
  const angle=-135+value*2.7;
  const radius=14+value*.34;
  const gloss=finish==='Matte'?.08:finish==='Satin'?.22:.42;

  function fromPointer(e:PointerEvent<HTMLDivElement>){
    const r=dial.current!.getBoundingClientRect();
    let deg=Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI+90;
    if(deg>180)deg-=360;
    deg=Math.max(-135,Math.min(135,deg));
    setValue(clamp((deg+135)/2.7));
  }
  function onKey(e:KeyboardEvent){
    const step=e.shiftKey?10:2;
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();setValue(v=>clamp(v+step))}
    else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();setValue(v=>clamp(v-step))}
    else if(e.key==='Home'){e.preventDefault();setValue(0)}
    else if(e.key==='End'){e.preventDefault();setValue(100)}
  }
  const toggle=(name:string)=>setOn(list=>list.includes(name)?list.filter(n=>n!==name):[...list,name]);
  const ring=2*Math.PI*34;
  const vars={'--v':value/100,'--angle':`${angle}deg`,'--radius':`${radius}px`,'--gloss':gloss} as CSSProperties;

  return <section className={s.section} aria-labelledby="bench-stage-title">
    <div className={s.copy}>
      <p className={s.eyebrow}>On the bench</p>
      <h2 id="bench-stage-title">Small parts.<br/><span>One feeling.</span></h2>
      <p>Turn the dial, drag the slider, change the finish. Every part answers to the same value, and the tile follows.</p>
    </div>
    <div className={s.stage} style={vars}>
      <div className={s.plinth} aria-hidden="true"/>
      <div className={s.grid}>
        <div className={s.dialWrap}>
          <div ref={dial} className={s.dial} role="slider" tabIndex={0} aria-label="Softness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={`${value} percent`}
            onKeyDown={onKey} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);fromPointer(e)}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))fromPointer(e)}}>
            <span className={s.ticks} aria-hidden="true"/>
            <span className={s.knob} aria-hidden="true"><span className={s.pointer}/></span>
          </div>
          <p className={s.partLabel}>Dial</p>
        </div>

        <div className={`${s.column} ${s.controls}`}>
          <div className={s.segment} role="radiogroup" aria-label="Finish" data-i={finishes.indexOf(finish)}>
            <span className={s.thumb} aria-hidden="true"/>
            {finishes.map(f=><button type="button" role="radio" aria-checked={finish===f} key={f} onClick={()=>setFinish(f)}>{f}</button>)}
          </div>
          <label className={s.slider}>
            <span className={s.sliderHead}><span>Softness</span><output>{value}%</output></span>
            <input type="range" min={0} max={100} value={value} onChange={e=>setValue(Number(e.target.value))} style={{'--fill':`${value}%`} as CSSProperties}/>
          </label>
          <div className={s.chips} role="group" aria-label="Extras">
            {extras.map(x=><button type="button" key={x} aria-pressed={on.includes(x)} onClick={()=>toggle(x)}><i aria-hidden="true"/>{x}</button>)}
          </div>
        </div>

        <div className={s.previewWrap}>
          <div className={s.tile} data-rim={on.includes('Rim light')} data-shadow={on.includes('Soft shadow')} data-glow={on.includes('Inner glow')}>
            <BrandMark className={s.tileMark}/>
          </div>
          <p className={s.partLabel}>Tile</p>
        </div>

        <div className={`${s.column} ${s.readout}`}>
          <div className={s.ring}>
            <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" className={s.ringTrack}/><circle cx="40" cy="40" r="34" className={s.ringFill} strokeDasharray={ring} strokeDashoffset={ring*(1-value/100)}/></svg>
            <strong>{value}</strong><span>%</span>
          </div>
          <div className={s.note} role="status" aria-live="polite">
            <span className={s.noteDot} aria-hidden="true"/>
            <p><b>{finish} finish</b><br/>{value<34?'Crisp corners':value<67?'Gently rounded':'Fully softened'}, {on.length?on.join(', ').toLowerCase():'no extras'}.</p>
          </div>
        </div>
      </div>
    </div>
    <p className={s.caption}>A live design study. No data is sent or saved.</p>
  </section>;
}
