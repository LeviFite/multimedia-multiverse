const { performance } = require('perf_hooks');
const fs = require('fs');

// Mock localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val; }
};

// Create a large fake db
const db = {};
for (let i = 0; i < 50000; i++) {
  db[`user${i}@example.com`] = { id: `hash${i}`, email: `user${i}@example.com`, password: 'password123', displayName: `User${i}`, avatar: '', bio: '', subscribed: false, media: [] };
}
localStorage.setItem('demo_users_db', JSON.stringify(db));

async function measure() {
  const start = performance.now();

  // Current behavior
  let parsedDb = {};
  const stored = localStorage.getItem('demo_users_db');
  if (stored) parsedDb = JSON.parse(stored);

  const end = performance.now();
  console.log(`Synchronous load took: ${end - start} ms`);
}

measure();
