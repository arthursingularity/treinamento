import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const glbPath = join(dirname(fileURLToPath(import.meta.url)), 'public', 'estoque.glb');
const buf = readFileSync(glbPath);
const chunk0Len = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Len));

const lines = [];
const addressNodes = ['05D22N1','05D22N2','05D22N3','05D23N1','05D23N2','05D23N3','05D24N1','05D24N2','05D24N3'];
gltf.nodes.forEach((n, i) => {
  if (addressNodes.includes(n.name)) {
    const kids = n.children || [];
    const kidNames = kids.map(ci => gltf.nodes[ci]?.name);
    lines.push(`"${n.name}" children=${kids.length} childNames=${JSON.stringify(kidNames)}`);
  }
});

const scene0 = gltf.scenes?.[0];
const rootNames = (scene0?.nodes || []).map(i => gltf.nodes[i]?.name);
lines.push(`\nScene roots: ${JSON.stringify(rootNames)}`);

writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'glb_parents.txt'), lines.join('\n'), 'utf8');
console.log('Done');
