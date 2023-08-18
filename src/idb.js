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

export async function categoriesAddNew(name, budget, monthly) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readwrite");
	const store = tx.objectStore(TABLE_CATEGORIES);
	await store.add({ name, budget: budget ? parseFloat(budget) : 0, monthly });
	await tx.complete;
}

export async function categoriesGetAll() {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readonly");
	const store = tx.objectStore(TABLE_CATEGORIES);
	return store.getAll();
}

export async function categoriesGetById(id) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readonly");
	const store = tx.objectStore(TABLE_CATEGORIES);
	const item = await store.get(parseInt(id, 10));
	return item;
}

export async function deleteAllData() {
	try {
		await deleteDB(DB_NAME);
	} catch (error) {
		console.error("Error deleting database:", error);
	}
}

export async function purchasesAdd(categoryId, amount, date, message) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readwrite");
	const store = tx.objectStore(TABLE_PURCHASES);
	const data = { categoryId: parseInt(categoryId, 10), amount: parseFloat(amount), date, message };
	await store.add(data);
	await tx.complete;
}

export async function purchasesGetByCategory(categoryId) {
	const past30Days = 30 * 24 * 60 * 60 * 1000; // Hardcode 30 days for now?
	const endDate = new Date(); // Current date and time
	const startDate = new Date(endDate - past30Days); // Date 30 days ago
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readonly");
	const store = tx.objectStore(TABLE_PURCHASES);
	const index = store.index(TABLE_PURCHASES_INDEX_CATEGORYID);
	const range = IDBKeyRange.bound(
		[parseInt(categoryId, 10), startDate],
		[parseInt(categoryId, 10), endDate],
		false,
		true
	);
	const data = await index.getAll(range);
	const sortedData = data.sort((a, b) => b.date - a.date);
	return sortedData;
}

export async function purchasesGetByRange(startDate, endDate) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readonly");
	const store = tx.objectStore(TABLE_PURCHASES);
	const index = store.index(TABLE_PURCHASES_INDEX_DATE);
	const range = IDBKeyRange.bound(startDate, endDate, false, false);
	const data = await index.getAll(range);
	return data;
}

export async function purchasesGetRecent() {
	const startDate = new Date();
	startDate.setHours(0, 0, 0, 0);
	const endDate = new Date();
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readonly");
	const store = tx.objectStore(TABLE_PURCHASES);
	const index = store.index(TABLE_PURCHASES_INDEX_DATE);
	const range = IDBKeyRange.bound(startDate, endDate, false, true);
	const data = await index.getAll(range);
	const sortedData = data.sort((a, b) => b.date - a.date);
	return sortedData.slice(0, 3);
}
