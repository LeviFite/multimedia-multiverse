const REMOTE_ENABLED = true;
let activeUploads = 0;
let maxActiveUploads = 0;

const uploadToSupabase = async (f) => {
  activeUploads++;
  if (activeUploads > maxActiveUploads) maxActiveUploads = activeUploads;
  // simulate network delay
  await new Promise(r => setTimeout(r, 10));
  activeUploads--;
  return `https://fake.url/${f.name}`;
};

const uploadUnbounded = async (files) => {
  maxActiveUploads = 0;
  await Promise.all(files.map(async (f) => {
    if (REMOTE_ENABLED) await uploadToSupabase(f);
  }));
  console.log(`Unbounded max concurrent uploads: ${maxActiveUploads}`);
};

const uploadBatched = async (files) => {
  maxActiveUploads = 0;
  const CONCURRENCY_LIMIT = 3;
  for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
    const batch = files.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(batch.map(async (f) => {
      if (REMOTE_ENABLED) await uploadToSupabase(f);
    }));
  }
  console.log(`Batched max concurrent uploads: ${maxActiveUploads}`);
};

const run = async () => {
  const files = Array.from({ length: 100 }, (_, i) => ({ name: `file${i}.png` }));
  await uploadUnbounded(files);
  await uploadBatched(files);
};
run();
