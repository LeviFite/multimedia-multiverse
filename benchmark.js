import { performance } from 'perf_hooks';

const TOP_THREADS = [
  { title: 'Welcome! Read this first', author: 'ModTeam', replies: 42, category: 'general' },
  { title: 'Best camera phone in 2025?', author: 'PixelPioneer', replies: 31, category: 'photos' },
  { title: 'Your top 3 comfort movies', author: 'ReelFeely', replies: 64, category: 'movies' },
  { title: 'Share your study hacks', author: 'FocusBuddy', replies: 28, category: 'learn' },
  { title: 'Underrated indie games', author: 'QuestGiver', replies: 57, category: 'gaming' },
  { title: 'Daily music rec thread 🎧', author: 'CrateDigger', replies: 51, category: 'music' },
  { title: 'Resume roast (be nice)', author: 'HiringHelper', replies: 19, category: 'work' },
  { title: 'Laptop buyers guide', author: 'NerdBird', replies: 44, category: 'tech' },
  { title: 'Good deeds of the day', author: 'HelpHive', replies: 22, category: 'help' },
  { title: 'World news catch‑up', author: 'MapMaker', replies: 33, category: 'world' },
];

const category = { key: 'music' };

function baseline() {
  const start = performance.now();
  for (let i = 0; i < 1000000; i++) {
    const result = TOP_THREADS.filter(t => t.category === category.key || category.key === 'general').slice(0,8);
  }
  const end = performance.now();
  console.log(`Baseline: ${end - start} ms`);
}

function optimized() {
  // Simulate useMemo caching the result
  let cachedCategoryKey = null;
  let cachedResult = null;

  const start = performance.now();
  for (let i = 0; i < 1000000; i++) {
    let result;
    if (cachedCategoryKey === category.key) {
      result = cachedResult;
    } else {
      result = TOP_THREADS.filter(t => t.category === category.key || category.key === 'general').slice(0,8);
      cachedCategoryKey = category.key;
      cachedResult = result;
    }
  }
  const end = performance.now();
  console.log(`Optimized: ${end - start} ms`);
}

baseline();
optimized();
