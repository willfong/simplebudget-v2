import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { categoriesGetById, purchasesAdd, purchasesGetByCategory } from "../idb";

export default function SpendDetailPage() {
	const { id } = useParams();
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const [categoryDetail, setCategoryDetail] = useState({});
	const [purchases, setPurchases] = useState({});
	const [spendAmount, setSpendAmount] = useState("");

	useEffect(() => {
		inputRef.current.focus();
		const fetchCategoryDetail = async () => {
			const data = await categoriesGetById(id);
			setCategoryDetail(data);
		};
		fetchCategoryDetail();

		const fetchPurchases = async () => {
			const results = await purchasesGetByCategory(id);
			const data = results.reduce((acc, item) => {
				const dateWithoutTime = new Date(item.date);
				dateWithoutTime.setHours(0, 0, 0, 0);
				if (!acc[dateWithoutTime]) {
					acc[dateWithoutTime] = [];
				}
				acc[dateWithoutTime].push(item);
				return acc;
			}, {});
			console.log(data);
			setPurchases(data);
		};
		fetchPurchases();
	}, [id]);

	const handleSpendAmount = (event) => {
		setSpendAmount(event.target.value);
	};

	const handleSpend = async () => {
		const date = new Date();
		await purchasesAdd(id, spendAmount, date);
		navigate("/spend");
	};

	return (
		<div className="p-2">
			<main className="px-4 py-2 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
					<div>
						<div className="rounded-md my-6 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 ">
							<h2 className="text-base font-semibold leading-7 text-center text-gray-500">{categoryDetail.name}</h2>
							<input
								ref={inputRef}
								type="tel"
								name="name"
								id="name"
								value={spendAmount}
								onChange={handleSpendAmount}
								className="block w-full border-0 p-4 text-gray-900 placeholder:text-gray-400 text-2xl sm:leading-6 text-center"
								placeholder="Amount"
							/>
							<button
								type="button"
								onClick={handleSpend}
								className="w-full my-4 rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
							>
								Spend
							</button>
						</div>

						{categoryDetail.budget && (
							<p className="mt-1 text-sm leading-6 text-gray-500">Budget: {categoryDetail.budget}</p>
						)}
						<nav className="h-full overflow-y-auto mt-4">
							{Object.keys(purchases).map((day) => (
								<div key={day} className="relative">
									<div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
										<h3>{format(new Date(day), "EEE, MMM dd yyyy")}</h3>
									</div>
									<ul className="divide-y divide-gray-100">
										{purchases[day].map((item) => (
											<li key={item.id} className="flex gap-x-4 px-3 py-5">
												<div className="min-w-0 flex">
													<p className="text-gray-500">{format(item.date, "HH:MM")}</p>
													<p className="ml-2 text-gray-900">{item.amount}</p>
												</div>
											</li>
										))}
									</ul>
								</div>
							))}
						</nav>
					</div>
				</div>
			</main>
		</div>
	);
}
