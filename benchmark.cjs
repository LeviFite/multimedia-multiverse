const { performance } = require('perf_hooks');

const categories = ['general', 'photos', 'movies', 'learn', 'gaming', 'music', 'work', 'tech', 'help', 'world'];
const TOP_THREADS = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  title: `Thread ${i}`,
  category: categories[Math.floor(Math.random() * categories.length)],
}));

// baseline
function runBaseline() {
  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    for (const cat of categories) {
      TOP_THREADS.filter(t => t.category === cat || cat === 'general').slice(0, 8);
    }
  }
  const end = performance.now();
  console.log(`Baseline: ${end - start} ms`);
}

// optimized
const THREADS_BY_CATEGORY = TOP_THREADS.reduce((acc, thread) => {
  if (!acc[thread.category]) acc[thread.category] = [];
  acc[thread.category].push(thread);
  return acc;
}, {});

function runOptimized() {
  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    for (const cat of categories) {
      if (cat === 'general') {
        TOP_THREADS.slice(0, 8);
      } else {
        (THREADS_BY_CATEGORY[cat] || []).slice(0, 8);
      }
    }
  }
  const end = performance.now();
  console.log(`Optimized: ${end - start} ms`);
}

runBaseline();
runOptimized();
