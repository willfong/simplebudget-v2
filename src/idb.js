import { openDB, deleteDB } from "idb";

const DB_NAME = "simplebudget";
const DB_VERSION = 2;
const TABLE_CATEGORIES = "categories";
const TABLE_PURCHASES = "purchases";
const TABLE_SETTINGS = "settings";
const TABLE_CURRENCY = "currency";
const TABLE_PLAN = "plan";
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
			if (!db.objectStoreNames.contains(TABLE_SETTINGS)) {
				db.createObjectStore(TABLE_SETTINGS, { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains(TABLE_CURRENCY)) {
				db.createObjectStore(TABLE_CURRENCY, { keyPath: "id", autoIncrement: true });
			}
			if (!db.objectStoreNames.contains(TABLE_PLAN)) {
				db.createObjectStore(TABLE_PLAN, { keyPath: "id", autoIncrement: true });
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

export async function categoriesUpdate(id, name, budget, monthly) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CATEGORIES, "readwrite");
	const store = tx.objectStore(TABLE_CATEGORIES);
	const data = { id: parseInt(id, 10), name, budget: parseFloat(budget), monthly };
	await store.put(data);
	await tx.complete;
}

export async function categoriesDelete(id) {
	const categoryId = parseInt(id, 10);
	const db = await dbPromise;
	const purchaseTx = db.transaction(TABLE_PURCHASES, "readwrite");
	const purchaseStore = purchaseTx.objectStore(TABLE_PURCHASES);
	const purchaseIndex = purchaseStore.index(TABLE_PURCHASES_INDEX_CATEGORYID);
	const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange; // For browser compatibility
	const range = IDBKeyRange.bound([categoryId], [categoryId + 1], true, true);

	purchaseIndex.openCursor(range).onsuccess = function (event) {
		const cursor = event.target.result;
		if (cursor) {
			cursor.delete();
			cursor.continue();
		}
	};

	await purchaseTx.complete;

	const categoryTx = db.transaction(TABLE_CATEGORIES, "readwrite");
	const categoryStore = categoryTx.objectStore(TABLE_CATEGORIES);
	await categoryStore.delete(categoryId);
	await categoryTx.complete;
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

export async function purchasesDeleteById(id) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PURCHASES, "readwrite");
	const store = tx.objectStore(TABLE_PURCHASES);
	await store.delete(parseInt(id, 10));
	await tx.complete;
}

export async function dataExport() {
	const db = await openDB(DB_NAME);

	const data = {};

	for (let storeName of db.objectStoreNames) {
		const transaction = db.transaction(storeName, "readonly");
		const store = transaction.objectStore(storeName);
		data[storeName] = await store.getAll();
	}

	return JSON.stringify(data);
}

export async function dataImport(jsonData) {
	const db = await openDB(DB_NAME);
	const data = JSON.parse(jsonData);

	for (let storeName of db.objectStoreNames) {
		if (data[storeName]) {
			const transaction = db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			await store.clear();

			for (let item of data[storeName]) {
				if (item.date && typeof item.date === "string") {
					const potentialDate = new Date(item.date);
					if (!isNaN(potentialDate.getTime())) {
						item.date = potentialDate;
					}
				}

				await store.put(item);
			}
		}
	}
}

export async function settingsSet(key, value) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_SETTINGS, "readwrite");
	const store = tx.objectStore(TABLE_SETTINGS);
	const existingSetting = await store.get(key);

	if (existingSetting) {
		await store.put({ id: key, value });
	} else {
		await store.add({ id: key, value });
	}
	await tx.complete;
}

export async function settingsGet() {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_SETTINGS, "readonly");
	const store = tx.objectStore(TABLE_SETTINGS);

	const settingsArray = await store.getAll();

	await tx.complete;

	const settingsObject = {};
	for (let setting of settingsArray) {
		settingsObject[setting.id] = setting.value;
	}

	return settingsObject;
}

export async function currencySet(key, value) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CURRENCY, "readwrite");
	const store = tx.objectStore(TABLE_CURRENCY);
	const existingSetting = await store.get(key);

	if (existingSetting) {
		await store.put({ id: key, value });
	} else {
		await store.add({ id: key, value });
	}
	await tx.complete;
}

export async function currencyDelete(key) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CURRENCY, "readwrite");
	const store = tx.objectStore(TABLE_CURRENCY);

	await store.delete(key);

	await tx.complete;
}

export async function currencyGetAll() {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_CURRENCY, "readonly");
	const store = tx.objectStore(TABLE_CURRENCY);

	const settingsArray = await store.getAll();

	await tx.complete;

	const settingsObject = {};
	for (let setting of settingsArray) {
		settingsObject[setting.id] = setting.value;
	}

	return settingsObject;
}

export async function planGetAll() {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PLAN, "readonly");
	const store = tx.objectStore(TABLE_PLAN);
	return await store.getAll();
}

export async function planAdd(data) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PLAN, "readwrite");
	const store = tx.objectStore(TABLE_PLAN);
	await store.add(data);
	await tx.complete;
}

export async function planDelete(key) {
	const db = await dbPromise;
	const tx = db.transaction(TABLE_PLAN, "readwrite");
	const store = tx.objectStore(TABLE_PLAN);
	await store.delete(key);
	await tx.complete;
}
