// Fake LocalStorage for node
global.localStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  clear: function() {
    this.store = {};
  }
};

function runBenchmark() {
  const t0 = performance.now();

  for (let i = 0; i < 100000; i++) {
    const key = `test_key_${i}`;
    localStorage.setItem(key, JSON.stringify({ data: 'mock_data', index: i, array: [1,2,3,4,5,6,7,8,9,10] }));
  }

  const t1 = performance.now();

  let totalTimeSync = 0;
  for (let i = 0; i < 100000; i++) {
    const key = `test_key_${i}`;
    // Simulate what the useState does currently (synchronous parsing and reading):
    const t2 = performance.now();
    let val;
    try { const v = localStorage.getItem(key); val = v ? JSON.parse(v) : null; } catch { val = null; }
    const t3 = performance.now();
    totalTimeSync += (t3 - t2);
  }

  let totalTimeAsyncInit = 0;
  for (let i = 0; i < 100000; i++) {
    const key = `test_key_${i}`;
    // Simulate what the new useState does (just sets initial value):
    const t4 = performance.now();
    let val = null; // initialized to fallback
    const t5 = performance.now();
    totalTimeAsyncInit += (t5 - t4);
  }

  console.log(`Setup time: ${t1 - t0}ms`);
  console.log(`Sync Read time (100000 items): ${totalTimeSync}ms`);
  console.log(`Async Initial Render setup time (100000 items): ${totalTimeAsyncInit}ms`);
}

runBenchmark();
