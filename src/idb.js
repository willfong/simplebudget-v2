// indexedDB.js

import { openDB } from "idb";

const DB_NAME = "simplebudget";
const DB_VERSION = 1;
const TABLE_CATEGORIES = "categories";

async function initializeDB() {
	return await openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(TABLE_CATEGORIES)) {
				db.createObjectStore(TABLE_CATEGORIES, { keyPath: "id", autoIncrement: true });
			}
		},
	});
}

const dbPromise = initializeDB();

async function categoriesAddNew(data) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readwrite");
	const store = tx.objectStore(TABLE_CATEGORIES);
	await store.add(data);
	await tx.complete;
}

async function categoriesGetAll() {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readonly");
	const store = tx.objectStore(TABLE_CATEGORIES);
	return store.getAll();
}

async function deleteAllData() {
	const db = await dbPromise;
	const objectStoreNames = db.objectStoreNames;
	for (let i = 0; i < objectStoreNames.length; i++) {
		const objectStoreName = objectStoreNames[i];
		const transaction = db.transaction([objectStoreName], "readwrite");
		const objectStore = transaction.objectStore(objectStoreName);
		const clearRequest = objectStore.clear();

		clearRequest.onerror = function (event) {
			console.error(`Error clearing data from object store ${objectStoreName}:`, event.target.error);
		};

		clearRequest.onsuccess = function (event) {
			console.log(`Data cleared from object store ${objectStoreName}`);
		};
	}
}

export { categoriesAddNew, categoriesGetAll, deleteAllData };
