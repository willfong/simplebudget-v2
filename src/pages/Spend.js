import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { categoriesGetAll, purchasesGetRecent } from "../idb";
import { formatDistanceToNow } from "date-fns";

export default function SpendPage() {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [recent, setRecent] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			const data = await categoriesGetAll();
			if (data.length === 0) {
				navigate("/settings");
			}
			setCategories(data);
		};
		fetchCategories();
		const fetchRecent = async () => {
			const data = await purchasesGetRecent();
			setRecent(data);
			console.log(data);
		};
		fetchRecent();
	}, [navigate]);

	return (
		<div>
			{recent.length > 0 && categories.length > 0 && (
				<div className="p-4">
					<p className="text-sm font-semibold text-slate-400">Recent purchases today</p>
					<ul className="mt-2">
						{recent.map((p) => (
							<li key={p.id} className="text-sm text-slate-400">
								{categories[p.categoryId]["name"]}: {p.amount.toLocaleString()} (
								{formatDistanceToNow(p.date, { addSuffix: true })})
							</li>
						))}
					</ul>
				</div>
			)}
			<ul className="">
				{categories.map((c) => (
					<li
						key={c.id}
						className="relative flex justify-between gap-x-6 px-4 py-8 sm:px-6 lg:px-8 bg-white m-2 border-2 border-gray-200"
					>
						<div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
							<div className="min-w-0 flex-auto">
								<p className="text-lg font-semibold leading-6 text-gray-900">
									<Link to={`/spend/${c.id}`}>
										<span className="absolute inset-x-0 -top-px bottom-0" />
										{c.name}
									</Link>
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
							<div className="sm:block">
								<p className="mt-1 text-xs leading-5 text-gray-500">{c.budget ? c.budget.toLocaleString() : ""}</p>
							</div>
							<ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
