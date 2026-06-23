const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes("export const runtime = 'edge';")) {
        fs.writeFileSync(p, c.replace("export const runtime = 'edge';", ""));
        console.log('Removed from ' + p);
      }
    }
  });
}

walk('src');
