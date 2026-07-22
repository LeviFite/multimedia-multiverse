const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: "http://localhost" });
global.window = dom.window;
global.URL = dom.window.URL;
// jsdom creates a mock createObjectURL
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => 'blob:http://localhost/' + Math.random();
  global.URL.revokeObjectURL = () => {};
}

let createCount = 0;
const origCreate = global.URL.createObjectURL;
global.URL.createObjectURL = (f) => {
  createCount++;
  return origCreate(f);
}

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
  const start1 = process.hrtime.bigint();
  await handleMedia(files);
  const end1 = process.hrtime.bigint();
  console.log(`Original: ${Number(end1 - start1) / 1e6} ms, Object URLs created: ${createCount}`);

  createCount = 0;
  const start2 = process.hrtime.bigint();
  await handleMediaOptimized(files);
  const end2 = process.hrtime.bigint();
  console.log(`Optimized: ${Number(end2 - start2) / 1e6} ms, Object URLs created: ${createCount}`);
}

run();
