const { performance } = require('perf_hooks');

const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val; }
};

const db = {};
for (let i = 0; i < 50000; i++) {
  db[`user${i}@example.com`] = { id: `hash${i}`, email: `user${i}@example.com`, password: 'password123', displayName: `User${i}`, avatar: '', bio: '', subscribed: false, media: [] };
}
localStorage.setItem('demo_users_db', JSON.stringify(db));

async function measureSync() {
  const start = performance.now();
  let parsedDb = {};
  const stored = localStorage.getItem('demo_users_db');
  if (stored) parsedDb = JSON.parse(stored);
  const end = performance.now();
  console.log(`Sync load blocked for: ${end - start} ms`);
}

async function measureAsync() {
  const start = performance.now();
  let parsedDb = {};

  // Yield to event loop
  await new Promise(r => setTimeout(r, 0));

  const stored = localStorage.getItem('demo_users_db');
  if (stored) parsedDb = JSON.parse(stored);

  const end = performance.now();
  console.log(`Async load total time (including yield): ${end - start} ms`);
}

async function run() {
  await measureSync();
  await measureAsync();
}
run();
