const { performance } = require('perf_hooks');

// Mock URL.createObjectURL since it's a browser API
// We'll simulate memory leak by allocating real memory to object URLs
const objectUrls = new Set();
let memoryLeaked = 0;

global.URL = {
  createObjectURL: (blob) => {
    const id = `blob:${Date.now()}-${Math.random()}`;
    objectUrls.add(id);
    memoryLeaked += blob.size; // simulate holding memory
    return id;
  },
  revokeObjectURL: (url) => {
    if (objectUrls.has(url)) {
      objectUrls.delete(url);
      memoryLeaked -= 1024 * 1024; // simulate freeing 1MB
    }
  }
};

const REMOTE_ENABLED = true;
const uploadToSupabase = async (f) => `https://supabase.com/media/${f.name}`;

async function runBenchmark(name, handleFunc) {
  memoryLeaked = 0;
  objectUrls.clear();

  const iterations = 10000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    // Simulate a 1MB file upload
    const f = { name: `file${i}.jpg`, size: 1024 * 1024 };
    await handleFunc(f);
  }

  const end = performance.now();
  console.log(`${name}:`);
  console.log(`  Time: ${(end - start).toFixed(2)}ms`);
  console.log(`  Leaked Object URLs: ${objectUrls.size}`);
  console.log(`  Simulated Memory Leaked: ${(memoryLeaked / 1024 / 1024).toFixed(2)} MB`);
  return end - start;
}

async function unoptimized(f) {
  let url = URL.createObjectURL(f);
  if (REMOTE_ENABLED) url = await uploadToSupabase(f);
  // leaked!
  return url;
}

async function optimized(f) {
  let url;
  if (REMOTE_ENABLED) {
    url = await uploadToSupabase(f);
  } else {
    url = URL.createObjectURL(f);
  }
  return url;
}

async function main() {
  await runBenchmark('Unoptimized (Leaking)', unoptimized);
  console.log('');
  await runBenchmark('Optimized (No Leak)', optimized);
}
main();
