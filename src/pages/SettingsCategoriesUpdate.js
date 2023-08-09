import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { categoriesGetById } from "../idb";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function SettingsCategoriesUpdatePage() {
	const { id } = useParams();
	const [categoryDetail, setCategoryDetail] = useState({});
	const [newName, setNewName] = useState("");
	const [newBudget, setNewBudget] = useState(0);
	const [newMonthly, setNewMonthly] = useState(false);
	useEffect(() => {
		const fetchCategoryDetail = async () => {
			const data = await categoriesGetById(id);
			setCategoryDetail(data);
			setNewName(data.name);
			setNewBudget(data.budget);
			setNewMonthly(data.monthly);
			console.log(data);
		};
		fetchCategoryDetail();
	}, [id]);

	return (
		<div className="p-2">
			<main className="px-4 py-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-8 sm:space-y-20 lg:mx-0 lg:max-w-none">
					<p className="text-2xl font-medium text-zinc-700 ">Category Update: {categoryDetail.name}</p>
					<div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 bg-white p-4 ">
						<div className="col-span-full ">
							<label htmlFor="rename" className="block text-sm font-medium leading-6 text-gray-900">
								Rename
							</label>
							<input
								type="text"
								name="rename"
								id="rename"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
							/>
							{newName.trim() !== categoryDetail.name && (
								<p className="text-sm text-zinc-400">Original Value: {categoryDetail.name}</p>
							)}
						</div>

						<div className="col-span-full">
							<label htmlFor="budget" className="block text-sm font-medium leading-6 text-gray-900">
								Budget
							</label>
							<input
								type="text"
								name="budget"
								id="budget"
								value={newBudget}
								onChange={(e) => setNewBudget(e.target.value)}
								className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
							/>
							<p className="text-sm text-zinc-400">
								{parseFloat(newBudget) > 999 ? parseFloat(newBudget).toLocaleString() : ""}
							</p>
							{parseFloat(newBudget) !== categoryDetail.budget && (
								<p className="text-sm text-zinc-400">Original Value: {categoryDetail.budget?.toLocaleString()}</p>
							)}
						</div>

						<Switch.Group as="div" className="flex items-center">
							<Switch
								checked={newMonthly}
								onChange={setNewMonthly}
								className={classNames(
									newMonthly ? "bg-zinc-500" : "bg-zinc-100",
									"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
								)}
							>
								<span className="sr-only">Use setting</span>
								<span
									aria-hidden="true"
									className={classNames(
										newMonthly ? "translate-x-5" : "translate-x-0",
										"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
									)}
								/>
							</Switch>
							<Switch.Label as="span" className="ml-3 text-sm">
								<span className="font-medium text-zinc-500">{newMonthly ? "Monthly Budget" : "Daily Budget"}</span>
							</Switch.Label>
						</Switch.Group>
					</div>
					<button onClick={update}>Update</button>
				</div>
			</main>
		</div>
	);
}
