import React, { useState, useEffect } from "react";
import SettingsCategoriesDetails from "./SettingsCategoriesDetail";
import { categoriesAddNew, categoriesGetAll } from "../idb";

export default function SettingsCategories() {
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryBudget, setNewCategoryBudget] = useState("");

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const data = await categoriesGetAll();
		setCategories(data);
	};

	const handleAddNewCategory = async () => {
		await categoriesAddNew(newCategoryName, newCategoryBudget);
		setNewCategoryName("");
		setNewCategoryBudget("");
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
					<SettingsCategoriesDetails key={c.id} name={c.name} budget={c.budget} />
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
					<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
						<input
							className="p-2"
							type="text"
							placeholder="Amount"
							value={newCategoryBudget}
							onChange={handleNewCategoryBudgetChange}
						/>
						<button
							type="button"
							className="font-semibold text-indigo-600 hover:text-indigo-500"
							onClick={handleAddNewCategory}
						>
							Add
						</button>
					</dd>
				</div>
			</dl>
		</div>
	);
}
