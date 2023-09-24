import React, { useState, useEffect } from "react";
import { settingsSet, settingsGet, currencyGetAll, currencySet, currencyDelete } from "../idb";

export default function SettingsCurrency() {
	const [defaultCurrency, setDefaultCurrency] = useState("");
	const [currencies, setCurrencies] = useState({});
	const [newCurrencyName, setNewCurrencyName] = useState("");
	const [newExchangeRate, setNewExchangeRate] = useState("");

	useEffect(() => {
		fetchSettings();
		fetchCurrencies();
	}, []);

	const fetchSettings = async () => {
		const settings = await settingsGet();
		setDefaultCurrency(settings.defaultCurrency || "");
	};

	const fetchCurrencies = async () => {
		const currencies = await currencyGetAll();
		setCurrencies(currencies || {});
	};

	const handleDefaultCurrencyChange = (event) => {
		setDefaultCurrency(event.target.value);
	};

	const saveDefaultCurrencySetting = async () => {
		await settingsSet("defaultCurrency", defaultCurrency);
	};

	const handleAddCurrency = async () => {
		await currencySet(newCurrencyName, parseFloat(newExchangeRate));
		setNewCurrencyName("");
		setNewExchangeRate("");
		await fetchCurrencies();
	};

	const deleteCurrency = async (name) => {
		await currencyDelete(name);
		await fetchCurrencies();
	};

	const updateExchangeRate = (name, newRate) => {
		const updatedCurrencies = currencies.map((cur) =>
			cur.name === name ? { ...cur, exchangeRate: parseFloat(newRate) } : cur
		);
		setCurrencies(updatedCurrencies);
	};

	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Currency</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">Set your base currency and exchange rates.</p>

			<div className="mt-4">
				<input
					type="text"
					value={defaultCurrency}
					onChange={handleDefaultCurrencyChange}
					className="border rounded p-2 w-full"
					placeholder="Enter default currency"
				/>
				<button onClick={saveDefaultCurrencySetting} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
					Save Default Currency
				</button>
			</div>

			<div className="mt-4">
				<input
					type="text"
					value={newCurrencyName}
					onChange={(e) => setNewCurrencyName(e.target.value)}
					className="border rounded p-2 w-full"
					placeholder="New Currency Name"
				/>
				<input
					type="number"
					value={newExchangeRate}
					onChange={(e) => setNewExchangeRate(e.target.value)}
					className="border rounded p-2 w-full mt-2"
					placeholder="New Currency Exchange Rate"
				/>
				<button onClick={handleAddCurrency} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
					Add New Currency
				</button>
			</div>

			<div className="mt-4">
				<h3 className="text-lg font-semibold leading-7 text-gray-900">Added Currencies</h3>
				<ul>
					{Object.keys(currencies).map((cur) => (
						<li key={cur} className="mt-2">
							<span className="mr-2">
								{currencies[cur]} {cur} to 1 {defaultCurrency}
							</span>

							<button onClick={() => deleteCurrency(cur)} className="bg-red-500 text-white px-2 py-1 rounded">
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
