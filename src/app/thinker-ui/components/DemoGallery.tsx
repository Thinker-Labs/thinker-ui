'use client';
import {BrandMark} from '../BrandMark';
import {useState} from 'react';
import {Home,LayoutGrid,BookOpen,UserRound} from 'lucide-react';
import {MaterialDock} from './MaterialDock';
import {MaterialMenu} from './MaterialMenu';
import styles from './components.module.css';
const icons=[Home,LayoutGrid,BookOpen,UserRound];
const items=['Home','Components','Toolkit','Profile'].map((label,i)=>{const Icon=icons[i];return {id:label.toLowerCase(),label,icon:i===0?<BrandMark/>:<Icon/>,description:['Your starting point','Explore the collection','Engineering rules','Your preferences'][i]}});
export function DockDemo(){const [value,setValue]=useState('home');return <div className={styles.demo}><MaterialDock items={items} value={value} onChange={setValue}/><p>Choose a destination. Hover or focus for labels.</p></div>}
export function MenuDemo(){const [value,setValue]=useState('home');return <div className={styles.demo}><MaterialMenu items={items.slice(0,3)} value={value} onChange={setValue}/><p>Collapse, select, or press Escape.</p></div>}
