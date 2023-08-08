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
	const [message, setMessage] = useState("");

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
			setPurchases(data);
		};
		fetchPurchases();
	}, [id]);

	const handleSpendAmount = (event) => {
		setSpendAmount(event.target.value);
	};

	const handleMessage = (event) => {
		setMessage(event.target.value);
	};

	const handleSpend = async () => {
		const date = new Date();
		await purchasesAdd(id, spendAmount, date, message);
		navigate("/spend");
	};

	return (
		<div className="p-2">
			<main className="px-4 py-2 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
					<div>
						<div className="rounded-md my-6 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 bg-white">
							<div className="flex justify-between">
								<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
									{categoryDetail.name}
								</label>
								<span className="text-sm  text-zinc-400" id="email-optional">
									{spendAmount ? parseFloat(spendAmount).toLocaleString() : ""}
								</span>
							</div>

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
							<input
								type="text"
								name="name"
								id="message"
								value={message}
								onChange={handleMessage}
								className="block w-full border-0 p-2 text-gray-900 placeholder:text-gray-400 text-base sm:leading-6 text-center"
								placeholder="Note (optional)"
							/>
							<button
								type="button"
								onClick={handleSpend}
								disabled={!spendAmount}
								className={`w-full my-4 rounded-md ${
									spendAmount ? "bg-zinc-200 text-zinc-600" : "bg-zinc-100 text-zinc-300"
								}  px-3.5 py-2.5 text-sm font-semibold  shadow-sm`}
							>
								Spend
							</button>
						</div>

						{categoryDetail.budget ? (
							<p className="mt-1 text-sm leading-6 text-gray-500">Budget: {categoryDetail.budget.toLocaleString()}</p>
						) : (
							""
						)}
						<nav className="h-full overflow-y-auto mt-4">
							{Object.keys(purchases).map((day) => (
								<div key={day} className="relative">
									<div className="sticky top-0 z-10 bg-zinc-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
										<h3>{format(new Date(day), "EEE, MMM dd yyyy")}</h3>
									</div>
									<ul className="divide-y divide-gray-100">
										{purchases[day].map((item) => (
											<li key={item.id} className="flex gap-x-4 px-3 py-5 bg-white">
												<div className="flex-none flex gap-x-2 items-center">
													<p className="text-gray-500">{format(item.date, "HH:MM")}</p>
												</div>
												<div className="flex-1 text-gray-500 overflow-hidden whitespace-nowrap">
													<p className="truncate">{item.message}</p>
												</div>
												<div className="flex-none flex-shrink-0 text-gray-900 text-right">
													{item.amount.toLocaleString()}
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
