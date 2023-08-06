import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { categoriesGetById, purchasesAdd, purchasesGetByCategory } from "../idb";

export default function SpendDetailPage() {
	const { id } = useParams();
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const [categoryDetail, setCategoryDetail] = useState({});
	const [purchases, setPurchases] = useState([]);
	const [spendAmount, setSpendAmount] = useState("");

	useEffect(() => {
		inputRef.current.focus();
		const fetchCategoryDetail = async () => {
			const data = await categoriesGetById(id);
			setCategoryDetail(data);
		};
		fetchCategoryDetail();

		const fetchPurchases = async () => {
			const data = await purchasesGetByCategory(id);
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
			<main className="px-4 py-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
					<div>
						<h2 className="text-base font-semibold leading-7 text-gray-900">{categoryDetail.name}</h2>

						<div className="rounded-md my-6 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 ">
							<input
								ref={inputRef}
								type="tel"
								name="name"
								id="name"
								value={spendAmount}
								onChange={handleSpendAmount}
								className="block w-full border-0 p-4 text-gray-900 placeholder:text-gray-400 text-2xl sm:leading-6"
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

						<p className="mt-1 text-sm leading-6 text-gray-500">Budget: {categoryDetail.budget}</p>
						{purchases.map((p) => (
							<p key={p.id} className="mt-1 text-sm leading-6 text-gray-500">
								{p.amount}
							</p>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
