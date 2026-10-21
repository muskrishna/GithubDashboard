
const store = new Map();
const MAX_ENTRIES = 500;

export function getCache(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

export function setCache(key, value, ttlMs) {
  if (store.size >= MAX_ENTRIES) {
    
    store.delete(store.keys().next().value);
  }
  store.set(key, { value, expires: Date.now() + ttlMs });
}
