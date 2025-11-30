const fs = require('fs');
const path = require('path');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

function resolveConflicts(content) {
  let out = content;
  while (true) {
    const s = out.indexOf('<<<<<<<');
    if (s === -1) break;
    const mid = out.indexOf('=======', s);
    const e = out.indexOf('>>>>>>>', mid);
    if (mid === -1 || e === -1) break;

    const aStart = out.indexOf('\n', s);
    const a = aStart === -1 ? out.substring(s, mid) : out.substring(aStart + 1, mid);
    const bStart = out.indexOf('\n', mid);
    const b = bStart === -1 ? out.substring(mid, e) : out.substring(bStart + 1, e);

    // Keep both blocks: a then b
    const replacement = (a.trim() === '' ? '' : a + '\n') + b.trimEnd();

    const afterLine = out.indexOf('\n', e);
    const afterIdx = afterLine === -1 ? out.length : afterLine + 1;

    out = out.substring(0, s) + replacement + out.substring(afterIdx);
  }
  return out;
}

function ensureDirExists(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  const root = process.cwd();
  const src = path.join(root, 'src');
  if (!fs.existsSync(src)) {
    console.error('No src/ directory found. Run this from project root.');
    process.exit(1);
  }

  const allFiles = walk(src).filter(f => /\.(ts|tsx|js|jsx)$/.test(f));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(root, `src_conflicts_backup_${timestamp}`);
  ensureDirExists(backupRoot);

  const processed = [];
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.indexOf('<<<<<<<') !== -1) {
      const rel = path.relative(root, file);
      const backupPath = path.join(backupRoot, rel);
      ensureDirExists(path.dirname(backupPath));
      fs.writeFileSync(backupPath, content, 'utf8');

      const newContent = resolveConflicts(content);
      fs.writeFileSync(file, newContent, 'utf8');
      processed.push(rel);
      console.log(`Processed: ${rel}`);
    }
  });

  console.log('---');
  console.log(`Backup of originals written to: ${backupRoot}`);
  console.log(`Total files processed: ${processed.length}`);
  if (processed.length === 0) console.log('No conflict markers found.');
}

main();
