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

console.time('O(1) Merge Lookup');
for (let i = 0; i < 1000; i++) {
  const categoryKey = categories[Math.floor(Math.random() * categories.length)];
  const listCat = TOP_THREADS_INDEXED[categoryKey] || [];
  if (categoryKey === 'general') {
    listCat.slice(0, 8).map(x => x.thread);
  } else {
    const listGen = TOP_THREADS_INDEXED['general'] || [];
    const result = [];
    let p = 0, q = 0;
    while (result.length < 8 && (p < listCat.length || q < listGen.length)) {
      const itemCat = p < listCat.length ? listCat[p] : null;
      const itemGen = q < listGen.length ? listGen[q] : null;
      if (itemCat && (!itemGen || itemCat.index < itemGen.index)) {
        result.push(itemCat.thread);
        p++;
      } else {
        result.push(itemGen.thread);
        q++;
      }
    }
  }
}
console.timeEnd('O(1) Merge Lookup');
