const REMOTE_ENABLED = true;

// Mock upload function
const uploadToSupabase = async (f) => {
  // simulate network delay and some CPU work
  await new Promise(r => setTimeout(r, 50));
  return `https://fake.url/${f.name}`;
};

// Original unbounded version
const uploadUnbounded = async (files) => {
  return await Promise.all(files.map(async (f) => {
    let url = "fake-url";
    if (REMOTE_ENABLED) url = await uploadToSupabase(f);
    return { url, name: f.name };
  }));
};

// Optimized batched version
const uploadBatched = async (files) => {
  const items = [];
  const CONCURRENCY_LIMIT = 5;
  for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
    const batch = files.slice(i, i + CONCURRENCY_LIMIT);
    const batchItems = await Promise.all(batch.map(async (f) => {
      let url = "fake-url";
      if (REMOTE_ENABLED) url = await uploadToSupabase(f);
      return { url, name: f.name };
    }));
    items.push(...batchItems);
  }
  return items;
};

const run = async () => {
  const files = Array.from({ length: 100 }, (_, i) => ({ name: `file${i}.png` }));

  console.time('unbounded');
  await uploadUnbounded(files);
  console.timeEnd('unbounded');

  console.time('batched');
  await uploadBatched(files);
  console.timeEnd('batched');
};

run();
