import React, { useMemo } from 'react';
import { renderToString } from 'react-dom/server';

const TOP_THREADS = Array.from({ length: 1000 }, (_, i) => ({
  title: 'Thread ' + i,
  author: 'User',
  replies: i,
  category: i % 2 === 0 ? 'general' : 'movies'
}));

function renderUnmemoized(category) {
  return TOP_THREADS.filter(t => t.category === category.key || category.key === 'general').slice(0,8);
}

let memoizedResult;
let lastKey;
function renderMemoized(category) {
  if (category.key !== lastKey) {
    memoizedResult = TOP_THREADS.filter(t => t.category === category.key || category.key === 'general').slice(0,8);
    lastKey = category.key;
  }
  return memoizedResult;
}

const cat = { key: 'movies' };
const iterations = 100000;

const start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  renderUnmemoized(cat);
}
const end1 = performance.now();

const start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  renderMemoized(cat);
}
const end2 = performance.now();

console.log(`Unmemoized filtering time: ${(end1 - start1).toFixed(2)}ms`);
console.log(`Memoized filtering time: ${(end2 - start2).toFixed(2)}ms`);
