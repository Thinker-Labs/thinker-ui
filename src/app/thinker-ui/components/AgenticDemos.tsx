'use client';
import{useState}from'react';
import{AgenticBadge,AgenticSetting,AgenticButton,AgenticSlider,AgenticTable,GuideSteps,AvatarStack,StatDelta,SegmentControl,UsageMeter}from'./AgenticControls';
import{RadiusScale}from'./RadiusScale';
import s from'./components.module.css';
const tones=['active','review','pending','blocked','new']as const;
const toneLabels={active:'Active',review:'In review',pending:'Pending',blocked:'Blocked',new:'New'};
export function AgenticDemo({id}:{id:string}){
 const[alerts,setAlerts]=useState(true);const[receipts,setReceipts]=useState(false);
 const[presses,setPresses]=useState(0);const[saving,setSaving]=useState(false);
 const[value,setValue]=useState(50);const[period,setPeriod]=useState('Week');
 if(id==='agentic-badge')return <div className={s.demo}><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{tones.map(tone=><AgenticBadge key={tone} tone={tone} label={toneLabels[tone]}/>)}</div><p>Five working states, one shape. Pill radius, 12px labels.</p></div>;
 if(id==='agentic-setting')return <div className={s.demo}><div style={{maxWidth:420}}><AgenticSetting label="Payment alerts" description="Notify me when a payment clears." checked={alerts} onChange={setAlerts}/><AgenticSetting label="Email receipts" description="Send a receipt for every payment." checked={receipts} onChange={setReceipts}/></div><p>Local preview. Nothing is saved.</p></div>;
 if(id==='agentic-actions')return <div className={s.demo}><div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}><AgenticButton onClick={()=>setPresses(p=>p+1)}>Get started · {presses}</AgenticButton><AgenticButton variant="secondary" onClick={()=>{setSaving(true);setTimeout(()=>setSaving(false),900)}} busy={saving}>Save changes</AgenticButton><AgenticButton disabled>Invite sent</AgenticButton></div><p>Full pill radius on every action. Busy state announces itself.</p></div>;
 if(id==='agentic-track')return <div className={s.demo}><div style={{maxWidth:420}}><AgenticSlider label="Review progress" value={value} onChange={setValue}/></div><p>Native range control. Arrow keys step the value.</p></div>;
 if(id==='agentic-table')return <div className={s.demo}><AgenticTable caption="Sample projects, sample people." rows={[{name:'Northwind',status:'active',statusLabel:'Active',progress:100,due:'Oct 14',people:['Maya Chen','Ben Ito']},{name:'Acme Co',status:'pending',statusLabel:'Pending',progress:50,due:'Oct 18',people:['Ben Ito','Maya Chen','Carla Ruiz','David Okafor']},{name:'Bluebird',status:'blocked',statusLabel:'Blocked',progress:20,due:'Oct 2',people:['Carla Ruiz']}]} /><p>Sample data only. Table radius follows the scale: 16px, cells stay square.</p></div>;
 if(id==='agentic-steps')return <div className={s.demo}><GuideSteps title="Publishing a component" steps={['Open the collection and choose New component.','Write the React source and its CSS Module side by side.','Check the preview at three widths, light and dark.','Open a draft pull request. A reviewer merges it.']}/><p>Numbered steps, hairline separators, nothing decorative.</p></div>;
 if(id==='agentic-stat')return <div className={s.demo}><div style={{display:'flex',flexWrap:'wrap',gap:12}}><StatDelta label="Components shipped" value="61" delta="14.8%" trend="up"/><StatDelta label="Open reviews" value="4" delta="2.1%" trend="down"/></div><p>One number per card. The delta badge repeats direction in words, not color alone.</p></div>;
 if(id==='agentic-segments')return <div className={s.demo}><div style={{display:'flex',flexDirection:'column',gap:10,alignItems:'flex-start'}}><SegmentControl label="Period" options={['Day','Week','Month','Year']} value={period} onChange={setPeriod}/><span style={{fontSize:13,color:'inherit'}}>Showing the {period.toLowerCase()} view.</span></div><p>Pressed states, quiet accent. Click or focus and press Space.</p></div>;
 if(id==='agentic-usage')return <div className={s.demo}><UsageMeter label="Context" total="200K" segments={[{label:'Chat',value:96},{label:'Files',value:41},{label:'Tools',value:22},{label:'System',value:11},{label:'Memory',value:6}]}/><p>Sample numbers, not account data. The legend repeats what color says.</p></div>;
 if(id==='agentic-avatars')return <div className={s.demo}><AvatarStack names={['Maya Chen','Ben Ito','Carla Ruiz','David Okafor','Nadia Ali','Omar Fathy']} max={4}/><p>Initials, not images. Overflow folds into a count.</p></div>;
 return <div className={s.demo}><RadiusScale/><p>One scale, every corner in the system. Pass your own values to adapt it.</p></div>;
}
