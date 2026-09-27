import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'training-data.js', 'favicon.svg'];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await Promise.all(files.map((file) => cp(join(root, file), join(dist, file))));
await cp(join(root, 'assets'), join(dist, 'assets'), { recursive: true });

console.log(`Sitio preparado en ${dist}`);
