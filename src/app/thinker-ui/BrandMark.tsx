import styles from './brand.module.css';
/** The site's original two-part Thinker asset, tinted for its surface. */
export function BrandMark({className=''}:{className?:string}){return <span aria-hidden="true" className={`${styles.mark} ${className}`}/>}
