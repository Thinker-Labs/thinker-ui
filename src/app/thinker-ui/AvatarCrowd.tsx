'use client';
import { useEffect, useRef, useState } from 'react';
import { ThinkerAvatar, type ThinkerAvatarState } from './components/ThinkerAvatar';
import { thinkerCast, thinkerCastColors } from './components/avatar-cast';
import type { AvatarDefinition } from '@/vendor/open-bot-avatar';
import bull from '@/vendor/open-bot-avatar/gallery/bull.json';
import colors from '@/vendor/open-bot-avatar/gallery/colors.json';
import s from './crowd.module.css';

const byId = (id: string) => thinkerCast.find(c => c.id === id) as AvatarDefinition;
const crowd: { def: AvatarDefinition; color: string; state: ThinkerAvatarState }[] = [
  { def: bull as unknown as AvatarDefinition, color: (colors as Record<string, string>).bull, state: 'working' },
  { def: byId('fox'), color: thinkerCastColors.fox, state: 'idle' },
  { def: byId('frog'), color: thinkerCastColors.frog, state: 'idle' },
  { def: byId('bear'), color: thinkerCastColors.bear, state: 'idle' },
  { def: byId('chick'), color: thinkerCastColors.chick, state: 'done' },
  { def: byId('elephant'), color: thinkerCastColors.elephant, state: 'idle' },
];

function Card({ item }: { item: (typeof crowd)[number] }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [happy, setHappy] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <li className={s.card}>
      <button ref={ref} type="button" className={s.pet} aria-label={`Pet ${item.def.name}`} onClick={() => { setHappy(true); window.setTimeout(() => setHappy(false), 1400); }}>
        {visible ? <ThinkerAvatar definition={item.def} state={item.state} mood={happy ? 'happy' : 'neutral'} color={item.color} size={168} /> : <span style={{ display: 'block', width: 168, height: 168 }} />}
      </button>
      <span className={s.name}>{item.def.name}</span>
      <span className={s.state} data-state={item.state}>{item.state}</span>
    </li>
  );
}

export default function AvatarCrowd() {
  return (
    <section className={s.section} aria-labelledby="crowd-title">
      <div className={s.copy}>
        <h2 id="crowd-title">14 avatars<br /><span>for agent states.</span></h2>
        <p className={s.body}>Six states: idle, thinking, working, waiting, blocked, done. Eyes follow the pointer, a tap makes them happy. All copyable.</p>
        <a className={s.link} href="/thinker-ui/components#thinker-avatar">Meet them all <span aria-hidden="true">↗</span></a>
      </div>
      <ul className={s.grid}>{crowd.map(item => <Card key={item.def.id} item={item} />)}</ul>
    </section>
  );
}
