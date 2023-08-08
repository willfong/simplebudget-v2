import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";

import SettingsCategoriesDetails from "./SettingsCategoriesDetail";
import { categoriesAddNew, categoriesGetAll } from "../idb";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function SettingsCategories() {
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryBudget, setNewCategoryBudget] = useState("");
	const [monthly, setMonthly] = useState(false);

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const data = await categoriesGetAll();
		setCategories(data);
	};

	const handleAddNewCategory = async () => {
		await categoriesAddNew(newCategoryName, newCategoryBudget, monthly);
		setNewCategoryName("");
		setNewCategoryBudget("");
		setMonthly(false);
		fetchCategories();
	};

	const handleNewCategoryNameChange = (event) => {
		setNewCategoryName(event.target.value);
	};

	const handleNewCategoryBudgetChange = (event) => {
		setNewCategoryBudget(event.target.value);
	};

	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Spending Categories</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">Budget and track spending by category.</p>

			<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
				{categories.map((c) => (
					<SettingsCategoriesDetails key={c.id} name={c.name} budget={c.budget} monthly={c.monthly} />
				))}
				<div className="pt-6 sm:flex">
					<dt className="sm:w-64 sm:flex-none sm:pr-6">
						<input
							className="p-2"
							type="text"
							placeholder="Name"
							value={newCategoryName}
							onChange={handleNewCategoryNameChange}
						/>
					</dt>
					<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto text-slate-400">
						<input
							className="p-2"
							type="text"
							placeholder="Amount"
							value={newCategoryBudget}
							onChange={handleNewCategoryBudgetChange}
						/>
						<Switch
							checked={monthly}
							onChange={setMonthly}
							className={classNames(
								monthly ? "bg-zinc-600" : "bg-zinc-100",
								"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
							)}
						>
							<span className="sr-only">Use setting</span>
							<span
								aria-hidden="true"
								className={classNames(
									monthly ? "translate-x-5" : "translate-x-0",
									"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
								)}
							/>
						</Switch>
						<p>{monthly ? "Monthly" : "Daily"}</p>
						<button type="button" className="font-semibold text-lime-700 " onClick={handleAddNewCategory}>
							Add
						</button>
					</dd>
				</div>
			</dl>
		</div>
	);
}
