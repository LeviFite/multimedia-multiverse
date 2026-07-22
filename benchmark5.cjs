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

  // simulated setBusy(true) - no yield

  let parsedDb = {};
  const stored = localStorage.getItem('demo_users_db');
  if (stored) parsedDb = JSON.parse(stored);

  const end = performance.now();
  console.log(`Sync load blocked for: ${end - start} ms`);
}

async function measureYield() {
  const start = performance.now();

  // yield to let UI paint
  await new Promise(resolve => setTimeout(resolve, 0));

  let parsedDb = {};
  const stored = localStorage.getItem('demo_users_db');
  if (stored) parsedDb = JSON.parse(stored);

  const end = performance.now();
  console.log(`Yield + load total time: ${end - start} ms`);
}

async function run() {
  await measureSync();
  await measureYield();
}
run();
