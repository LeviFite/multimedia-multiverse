// A simple benchmark without full React rendering to prove the cost of filter and slice
const { performance } = require('perf_hooks');

const TOP_THREADS = Array.from({ length: 100000 }, (_, i) => ({
  title: `Thread ${i}`,
  category: ['general', 'photos', 'movies', 'learn', 'gaming', 'music', 'work', 'tech', 'help', 'world'][i % 10],
}));

const category = { key: 'movies' };
const iterations = 1000;

function inlineApproach() {
  return TOP_THREADS.filter(t => t.category === category.key || category.key === 'general').slice(0, 8);
}

// Memoized approach simulates what React does: only calculating once if inputs don't change
let memoizedResult = null;
let lastKey = null;

function memoizedApproach(catKey) {
  if (lastKey === catKey) {
    return memoizedResult;
  }
  lastKey = catKey;
  memoizedResult = TOP_THREADS.filter(t => t.category === catKey || catKey === 'general').slice(0, 8);
  return memoizedResult;
}

console.log("Measuring Inline Approach...");
const startInline = performance.now();
for (let i = 0; i < iterations; i++) {
  inlineApproach();
}
const endInline = performance.now();
const timeInline = endInline - startInline;
console.log(`Inline approach took: ${timeInline.toFixed(2)}ms`);

console.log("\nMeasuring Memoized Approach...");
const startMemo = performance.now();
for (let i = 0; i < iterations; i++) {
  memoizedApproach(category.key);
}
const endMemo = performance.now();
const timeMemo = endMemo - startMemo;
console.log(`Memoized approach took: ${timeMemo.toFixed(2)}ms`);

console.log(`\nImprovement: ${((timeInline - timeMemo) / timeInline * 100).toFixed(2)}% faster`);
