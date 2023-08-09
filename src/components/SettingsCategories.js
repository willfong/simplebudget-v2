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
			</dl>
			<div className="pt-6 flex-col sm:flex-row space-y-6 border-t-2 mt-6">
				<p className="font-semibold text-slate-500">Add New Category</p>
				<input
					className="p-2 w-full sm:w-48"
					type="text"
					placeholder="Name"
					value={newCategoryName}
					onChange={handleNewCategoryNameChange}
				/>

				<Switch.Group as="div" className="flex items-center">
					<Switch
						checked={monthly}
						onChange={setMonthly}
						className={classNames(
							monthly ? "bg-zinc-500" : "bg-zinc-100",
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
					<Switch.Label as="span" className="ml-3 text-sm">
						<span className="font-medium text-zinc-500">{monthly ? "Monthly Budget" : "Daily Budget"}</span>
					</Switch.Label>
				</Switch.Group>
				<input
					className="p-2 w-full sm:w-48"
					type="text"
					placeholder={`${monthly ? "Monthly" : "Daily"} Budget Amount`}
					value={newCategoryBudget}
					onChange={handleNewCategoryBudgetChange}
				/>
				<button type="button" className="font-semibold text-lime-700 sm:ml-auto" onClick={handleAddNewCategory}>
					Add
				</button>
			</div>
		</div>
	);
}
