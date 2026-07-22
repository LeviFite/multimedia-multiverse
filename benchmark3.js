const TOP_THREADS = [];
const categories = ['general', 'movies', 'music', 'photos', 'gaming', 'learn', 'tech', 'world', 'help', 'work'];

// Generate 100,000 threads
for (let i = 0; i < 100000; i++) {
  TOP_THREADS.push({
    title: `Thread ${i}`,
    category: categories[Math.floor(Math.random() * categories.length)]
  });
}

// 1. Current O(N) approach
console.time('O(N) Filter');
for (let i = 0; i < 1000; i++) {
  const categoryKey = categories[Math.floor(Math.random() * categories.length)];
  const filtered = TOP_THREADS.filter(t => t.category === categoryKey || categoryKey === 'general').slice(0, 8);
}
console.timeEnd('O(N) Filter');

// 2. Pre-indexed approach
console.time('Index Creation');
const TOP_THREADS_INDEXED = {};
TOP_THREADS.forEach((t, i) => {
  if (!TOP_THREADS_INDEXED[t.category]) TOP_THREADS_INDEXED[t.category] = [];
  TOP_THREADS_INDEXED[t.category].push({ thread: t, index: i });
});
console.timeEnd('Index Creation');

console.time('O(1) Direct Lookup');
for (let i = 0; i < 1000; i++) {
  const categoryKey = categories[Math.floor(Math.random() * categories.length)];
  if (categoryKey === 'general') {
    TOP_THREADS.slice(0, 8);
  } else {
    const listCat = TOP_THREADS_INDEXED[categoryKey] || [];
    listCat.slice(0, 8).map(x => x.thread);
  }
}
console.timeEnd('O(1) Direct Lookup');
