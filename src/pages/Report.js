import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { purchasesGetByMonth, categoriesGetAll } from "../idb";
import ReportSummary from "../components/ReportSummary";
import ReportDetails from "../components/ReportDetails";

export default function ReportPage() {
	const navigate = useNavigate();
	const [purchases, setPurchases] = useState([]);
	const [categories, setCategories] = useState([]);
	const [summary, setSummary] = useState({});
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			const data = await categoriesGetAll();
			if (data.length === 0) {
				navigate("/settings");
			}
			setCategories(data);
		};
		Promise.all([fetchPurchases(), fetchCategories()]).then(() => {
			setDataLoaded(true);
		});
	}, [navigate]);

	const fetchPurchases = async () => {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();
		const data = await purchasesGetByMonth(currentYear, currentMonth);
		const purchasesData = data.reduce((acc, item) => {
			const dateKey = format(item.date, "yyyy-MM-dd");
			if (!acc[dateKey]) acc[dateKey] = [];
			acc[dateKey].push(item);
			return acc;
		}, {});
		setPurchases(purchasesData);
		const summaryData = data.reduce((acc, item) => {
			if (!acc[item.categoryId]) {
				acc[item.categoryId] = 0;
			}
			acc[item.categoryId] = acc[item.categoryId] + item.amount;
			return acc;
		}, {});
		setSummary(summaryData);
	};

	if (!dataLoaded) return null;

	return (
		<div className="py-10">
			<header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Report</h1>
				</div>
			</header>
			<main>
				<ReportSummary categories={categories} summary={summary} />
				<ReportDetails categories={categories} purchases={purchases} />
			</main>
		</div>
	);
}
