/**
 * Lightweight IndexedDB helper for the Game Wiki.
 * Handles DB opening/upgrading and exposes basic CRUD helpers per store.
 */
const DEFAULT_DB_NAME = "js-game-wiki";
const DEFAULT_DB_VERSION = 2;

// Default stores; extendable via openDatabase options.
const DEFAULT_STORES = {
  // app_config: { config_key, config_value }
  app_config: {
    keyPath: "config_key"
  },
  // game_config: { id, banner, sections: Array<{id, name, icon, path}>, news: Array<string> }
  game_config: {
    keyPath: "id"
  }
};

const DEFAULT_SEED_VERSION = "default_v2";
const DEFAULT_SEED_URL = "/data/seed.json";

/**
 * Open (or create/upgrade) the IndexedDB database.
 * @param {Object} options
 * @param {string} [options.name]
 * @param {number} [options.version]
 * @param {Record<string, {keyPath?: string|string[], autoIncrement?: boolean, indexes?: Array<{name: string, keyPath: string|string[], options?: IDBIndexParameters}>}>} [options.stores]
 * @returns {Promise<IDBDatabase>}
 */
export function openDatabase(options = {}) {
  const {
    name = DEFAULT_DB_NAME,
    version = DEFAULT_DB_VERSION,
    stores = DEFAULT_STORES
  } = options;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      const tx = request.transaction;
      applyStores(db, tx, stores);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      console.warn("IndexedDB upgrade blocked; close other tabs to continue.");
    };
  });
}

function applyStores(db, tx, stores) {
  Object.entries(stores).forEach(([storeName, config]) => {
    const { keyPath, autoIncrement, indexes = [] } = config;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath, autoIncrement });
    }

    const store = tx.objectStore(storeName);
    indexes.forEach((index) => {
      if (!store.indexNames.contains(index.name)) {
        store.createIndex(index.name, index.keyPath, index.options);
      }
    });
  });
}

const transactionDone = (tx, request) =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(request?.result);
    tx.onerror = () => reject(tx.error || request?.error);
    tx.onabort = () => reject(tx.error || request?.error);
  });

export function put(db, storeName, value) {
  const tx = db.transaction(storeName, "readwrite");
  const req = tx.objectStore(storeName).put(value);
  return transactionDone(tx, req);
}

export function bulkPut(db, storeName, values = []) {
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  values.forEach((value) => store.put(value));
  return transactionDone(tx);
}

export function get(db, storeName, key) {
  const tx = db.transaction(storeName, "readonly");
  const req = tx.objectStore(storeName).get(key);
  return transactionDone(tx, req);
}

export function getAll(db, storeName, query, count) {
  const tx = db.transaction(storeName, "readonly");
  const req = tx.objectStore(storeName).getAll(query, count);
  return transactionDone(tx, req);
}

export function getAllKeys(db, storeName, query, count) {
  const tx = db.transaction(storeName, "readonly");
  const req = tx.objectStore(storeName).getAllKeys(query, count);
  return transactionDone(tx, req);
}

export function remove(db, storeName, key) {
  const tx = db.transaction(storeName, "readwrite");
  const req = tx.objectStore(storeName).delete(key);
  return transactionDone(tx, req);
}

export function clear(db, storeName) {
  const tx = db.transaction(storeName, "readwrite");
  const req = tx.objectStore(storeName).clear();
  return transactionDone(tx, req);
}

/**
 * Seed default data if not already applied.
 * Marks the applied seed version in app_config under `seed:<version>`.
 * @param {IDBDatabase} db
 * @param {{url?: string, version?: string}} [options]
 * @returns {Promise<boolean>} true if seeding ran, false if skipped
 */
export async function ensureSeedData(db, options = {}) {
  const {
    url = DEFAULT_SEED_URL,
    version = DEFAULT_SEED_VERSION
  } = options;

  const seedMarkerKey = `seed:${version}`;
  const alreadySeeded = await get(db, "app_config", seedMarkerKey).catch(() => undefined);
  if (alreadySeeded) return false;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load seed data: ${response.status}`);
  const seed = await response.json();

  if (Array.isArray(seed.app_config) && seed.app_config.length) {
    await bulkPut(db, "app_config", seed.app_config);
  }
  if (Array.isArray(seed.game_config) && seed.game_config.length) {
    await bulkPut(db, "game_config", seed.game_config);
  }

  await put(db, "app_config", { config_key: seedMarkerKey, config_value: true });
  return true;
}
