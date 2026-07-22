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
  console.log(`Sync load took: ${end - start} ms`);
}

async function measureBlobAsync() {
  const start = performance.now();
  let parsedDb = {};
  const stored = localStorage.getItem('demo_users_db');
  if (stored) {
    const blob = new Blob([stored], { type: 'application/json' });
    parsedDb = await new Response(blob).json();
  }
  const end = performance.now();
  console.log(`Blob Async load took: ${end - start} ms`);
}

async function run() {
  await measureSync();
  await measureBlobAsync();
}
run();
