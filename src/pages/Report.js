import React, { useState, useEffect } from "react";

import { purchasesGetByMonth, categoriesGetAll } from "../idb";
import ReportSummary from "../components/ReportSummary";

export default function ReportPage() {
	const [purchases, setPurchases] = useState([]);
	const [categories, setCategories] = useState([]);
	const [summary, setSummary] = useState({});

	useEffect(() => {
		fetchPurchases();
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const data = await categoriesGetAll();
		setCategories(data);
	};

	const fetchPurchases = async () => {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();
		const data = await purchasesGetByMonth(currentYear, currentMonth);
		setPurchases(data);
		const summaryData = data.reduce((acc, item) => {
			if (!acc[item.categoryId]) {
				acc[item.categoryId] = 0;
			}
			acc[item.categoryId] = acc[item.categoryId] + parseFloat(item.amount);
			return acc;
		}, {});
		setSummary(summaryData);
	};

	return (
		<div className="py-10">
			<header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Report</h1>
				</div>
			</header>
			<main>
				<ReportSummary categories={categories} summary={summary} />
			</main>
		</div>
	);
}
