import { Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';
import {BrandMark} from './BrandMark';
import SiteHeader from './SiteHeader';
import LivingSections from './LivingSections';
import MaterialStage from './MaterialStage';
import ComponentStage from './ComponentStage';
import AvatarCrowd from './AvatarCrowd';
import styles from './page.module.css';

const headlineFont=Space_Grotesk({subsets:['latin'],display:'swap',variable:'--font-thinker-headline'});

export const metadata: Metadata = {
  title: 'Thinker UI | Tactile React components',
  description: 'Tactile React components. Live previews, connected interactions and copyable CSS Modules.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Thinker UI', description: 'Interactive React components with tactile materials, motion and copyable source.', url: 'https://www.thinkerlab.tech/thinker-ui' },
};

function Mark({ small = false }: { small?: boolean }) {
  return <BrandMark className={small?styles.smallBrand:styles.heroBrand}/>;
}

export default function ThinkerUIPage() {
  return (
    <main className={`${styles.page} ${headlineFont.variable} thinker-ui-surface`}>
      <a className={styles.skip} href="#overview">Skip to content</a>
      <SiteHeader />

      <section id="overview" className={styles.hero} aria-labelledby="ui-title">
        <div className={styles.cinematicBackdrop}><MaterialStage /></div><div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>A different kind of component collection</p><h1 id="ui-title">A little more<br/><span>feeling.</span></h1>
        <p className={styles.intro}>Thinker UI. Tactile React components.<br className={styles.desktopBreak} /> Less friction. More room for your ideas.</p>
        <div className={styles.actions}><Link className={styles.primary} href="/thinker-ui/components#gallery">Explore the collection <span aria-hidden="true">↗</span></Link><a className={styles.secondary} href="#living-title">Try the studio <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>

      <ComponentStage />

      <AvatarCrowd />

      <LivingSections />

      <footer className={styles.footer}><Link className={styles.brand} href="https://www.thinkerlab.tech"><Mark small />Thinker</Link><p>Thinker UI · Design preview</p><a href="#overview">Back to top ↑</a></footer>
    </main>
  );
}
