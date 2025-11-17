// IndexedDB wrapper for storing large design data
const DB_NAME = "zenspace-db";
const STORE_NAME = "designs";
const DB_VERSION = 1;

export interface SavedDesign {
  id: string;
  roomType: string;
  aesthetic: string;
  mood: string;
  image: string;
  timestamp: string;
}

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

// Migrate existing localStorage data to IndexedDB (one-time operation)
export const migrateFromLocalStorage = async (): Promise<void> => {
  const localData = localStorage.getItem("zenspace-designs");
  if (localData) {
    try {
      const designs: SavedDesign[] = JSON.parse(localData);
      const db = await initDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      for (const design of designs) {
        store.put(design);
      }

      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });

      // Clear localStorage after successful migration
      localStorage.removeItem("zenspace-designs");
    } catch (error) {
      console.error("Migration failed:", error);
    }
  }
};

// Get all designs
export const getAllDesigns = async (): Promise<SavedDesign[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// Save a design
export const saveDesign = async (design: SavedDesign): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(design);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Delete a design
export const deleteDesign = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Check if a design exists
export const designExists = async (id: string): Promise<boolean> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
};
