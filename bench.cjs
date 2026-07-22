let createCount = 0;
let revokeCount = 0;
const mockCreateObjectURL = (f) => {
  createCount++;
  return 'blob:http://localhost/' + Math.random();
};
const mockRevokeObjectURL = (url) => {
  revokeCount++;
};

global.URL = {
  createObjectURL: mockCreateObjectURL,
  revokeObjectURL: mockRevokeObjectURL,
};

const REMOTE_ENABLED = true;
const uploadToSupabase = async (f) => 'https://remote.url/' + f.name;

async function handleMedia(files) {
  const items = await Promise.all(files.map(async (f) => {
    let url = URL.createObjectURL(f);
    if (REMOTE_ENABLED) url = await uploadToSupabase(f);
    return ({ url, name: f.name });
  }));
  return items;
}

// In handleMedia, if REMOTE_ENABLED is true, the ObjectURL is overwritten.
// Thus, it is leaked if we don't revoke it. Also, even if REMOTE_ENABLED is true, creating it takes CPU and memory.
// Better: only create if !REMOTE_ENABLED, OR revoke it.
// If it's for local fallback (!REMOTE_ENABLED), we need it but in theory we shouldn't leak it if we don't use it.
// But wait, in the original code, the returned `url` is saved into state (`onUpdate({ ...user, media: next })`).
// If it's a local object URL, it's used to display the image. So we can't revoke it immediately if we use it.
// But if `REMOTE_ENABLED` is true, we fetch the supabase URL and OVERWRITE `url`, meaning the object URL is NEVER used and NEVER revoked.
// Wait, even worse, what if we just don't create it when `REMOTE_ENABLED` is true?

async function handleMediaOptimized(files) {
  const items = await Promise.all(files.map(async (f) => {
    let url;
    if (REMOTE_ENABLED) {
      url = await uploadToSupabase(f);
    } else {
      url = URL.createObjectURL(f);
    }
    return ({ url, name: f.name });
  }));
  return items;
}

async function run() {
  const files = Array.from({ length: 10000 }).map((_, i) => ({ name: `file${i}.jpg` }));

  createCount = 0;
  revokeCount = 0;
  const start1 = process.hrtime.bigint();
  await handleMedia(files);
  const end1 = process.hrtime.bigint();
  console.log(`Original: ${Number(end1 - start1) / 1e6} ms, Object URLs created: ${createCount}, revoked: ${revokeCount}`);

  createCount = 0;
  revokeCount = 0;
  const start2 = process.hrtime.bigint();
  await handleMediaOptimized(files);
  const end2 = process.hrtime.bigint();
  console.log(`Optimized: ${Number(end2 - start2) / 1e6} ms, Object URLs created: ${createCount}, revoked: ${revokeCount}`);
}

run();
