import { openDB, deleteDB } from "idb";

const DB_NAME = "simplebudget";
const DB_VERSION = 1;
const TABLE_CATEGORIES = "categories";
const TABLE_PURCHASES = "purchases";
const TABLE_PURCHASES_INDEX_DATE = "purchases_index_date";
const TABLE_PURCHASES_INDEX_CATEGORYID = "purchases_index_categoryid";

async function initializeDB() {
	return await openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(TABLE_CATEGORIES)) {
				db.createObjectStore(TABLE_CATEGORIES, { keyPath: "id", autoIncrement: true });
			}
			if (!db.objectStoreNames.contains(TABLE_PURCHASES)) {
				const tblPurchases = db.createObjectStore(TABLE_PURCHASES, { keyPath: "id", autoIncrement: true });
				tblPurchases.createIndex(TABLE_PURCHASES_INDEX_DATE, "date", { unique: false });
				tblPurchases.createIndex(TABLE_PURCHASES_INDEX_CATEGORYID, ["categoryId", "date"], { unique: false });
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

async function categoriesGetById(id) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readonly");
	const store = tx.objectStore(TABLE_CATEGORIES);
	const item = await store.get(parseInt(id, 10));
	return item;
}

async function deleteAllData() {
	await deleteDB(DB_NAME);
}

async function purchasesAdd(categoryId, amount, date, time) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readwrite");
	const store = tx.objectStore(TABLE_PURCHASES);
	await store.add({ categoryId, amount, date });
	await tx.complete;
}

async function purchasesGetByCategory(categoryId) {
	const past30Days = 30 * 24 * 60 * 60 * 1000; // Hardcode 30 days for now?
	const endDate = new Date(); // Current date and time
	const startDate = new Date(endDate - past30Days); // Date 30 days ago
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readonly");
	const store = tx.objectStore(TABLE_PURCHASES);
	const index = store.index(TABLE_PURCHASES_INDEX_CATEGORYID);
	const range = IDBKeyRange.bound([categoryId, startDate], [categoryId, endDate], false, true);
	const data = await index.getAll(range);
	const sortedData = data.sort((a, b) => b.date - a.date);
	return sortedData;
}

export { categoriesAddNew, categoriesGetAll, categoriesGetById, deleteAllData, purchasesAdd, purchasesGetByCategory };
