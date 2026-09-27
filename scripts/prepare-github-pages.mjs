import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('dist/client');
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'seenrain';
const basePath = process.env.GITHUB_PAGES === 'true' ? `/${repositoryName}` : '';

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

// Vinext prerenders correctly with an origin-root build; GitHub Pages adds the
// repository prefix at serving time, so add it to emitted asset URLs afterward.
if (basePath) {
  for (const file of walk(outputDir)) {
    if (!file.endsWith('.html')) continue;
    const name = path.basename(file);
    if (name === 'index.html' || name === '404.html') continue;

    const routeName = name.slice(0, -'.html'.length);
    const routeDir = path.join(path.dirname(file), routeName);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.renameSync(file, path.join(routeDir, 'index.html'));
  }

  for (const file of walk(outputDir)) {
    if (!/\.(html|rsc|js|css|json)$/.test(file)) continue;
    const original = fs.readFileSync(file, 'utf8');
    const updated = original.replaceAll('/_next/', `${basePath}/_next/`);
    if (updated !== original) fs.writeFileSync(file, updated);
  }
}
