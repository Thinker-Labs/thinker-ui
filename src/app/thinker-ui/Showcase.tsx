'use client';
import Link from 'next/link';
import { DataDemo } from './components/DataDemos';
import { catalog } from './components/catalog';
import s from './showcase.module.css';

/** Real library components, live. Replaces the old photo gallery. */
export default function Showcase() {
  return (
    <section className={s.section} aria-labelledby="showcase-title">
      <div className={s.head}>
        <p className={s.eyebrow}>The collection</p>
        <h2 id="showcase-title">{catalog.length} parts.<br /><span>All of them live.</span></h2>
        <Link className={s.link} href="/thinker-ui/components">Browse the collection <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={s.grid}>
        <article className={s.card}><h3>Calendar</h3><DataDemo id="material-calendar" /></article>
        <article className={s.card}><h3>Search choices</h3><DataDemo id="search-choices" /></article>
        <article className={`${s.card} ${s.wide}`}><h3>Table</h3><DataDemo id="material-table" /><p className={s.swipe}>Swipe the table sideways to see every column.</p></article>
      </div>
    </section>
  );
}
