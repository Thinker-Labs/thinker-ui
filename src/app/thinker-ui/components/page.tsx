import type { Metadata } from 'next';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import ComponentPreview from './ComponentPreview';
import {catalog} from './catalog';
export const metadata:Metadata={title:'Components | Thinker UI',description:'Interactive early component previews with exact React and CSS source.',robots:{index:false,follow:false}};
export default async function ComponentsPage(){
 const root=path.join(process.cwd(),'src/app/thinker-ui/components');
 const files=[...new Set(catalog.flatMap(item=>[item.file,item.css]))];
 const sources=Object.fromEntries(await Promise.all(files.map(async file=>[file,await readFile(path.join(root,file),'utf8')])));
 return <ComponentPreview sources={sources}/>;
}
