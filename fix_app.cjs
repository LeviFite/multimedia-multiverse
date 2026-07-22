const fs = require('fs');
let text = fs.readFileSync('src/App.jsx', 'utf8');

// The file had a syntax error. We just deleted a line and we need to fix it manually.
// Let's just fix it by ensuring `TopThreads` function is closed properly.
text = text.replace(/function TopThreads\(\) \{\n  return \(\n([\s\S]*?)    <\/section>\n  \);\nfunction CategorySection/m, `function TopThreads() {\n  return (\n$1    </section>\n  );\n}\n\nfunction CategorySection`);

fs.writeFileSync('src/App.jsx', text);
