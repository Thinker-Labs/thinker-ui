'use client';
import { useState } from 'react';
import { ThinkerAvatar, type ThinkerAvatarState } from './components/ThinkerAvatar';
import { MaterialTabs } from './components/MaterialControls';
import { thinkerCast } from './components/avatar-cast';
import type { AvatarDefinition } from '@/vendor/open-bot-avatar';
import s from './hero-proof.module.css';

const fox = thinkerCast.find(c => c.id === 'fox') as AvatarDefinition;
const lines: Record<string, string> = { idle: 'Waiting for the next thought.', working: 'Running tools. Eyes on the task.', done: 'Finished. Nothing left open.' };

/** Real components in the hero: the tabs are the library's MaterialTabs, the character is ThinkerAvatar. */
export default function HeroProof() {
  const [state, setState] = useState<'idle' | 'working' | 'done'>('idle');
  return (
    <div className={s.proof}>
      <div className={s.pet}><ThinkerAvatar definition={fox} state={state as ThinkerAvatarState} color="#b9ae97" size={120} /></div>
      <div className={s.side}>
        <p className={s.label}>Pick a state. The character answers.</p>
        <MaterialTabs label="Character state" value={state} onChange={v => setState(v as typeof state)} items={(['idle', 'working', 'done'] as const).map(id => ({ id, label: id[0].toUpperCase() + id.slice(1), content: lines[id] }))} />
      </div>
    </div>
  );
}
