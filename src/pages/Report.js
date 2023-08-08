import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { Switch } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { purchasesGetByMonth, categoriesGetAll } from "../idb";
import ReportSummary from "../components/ReportSummary";
import ReportDetails from "../components/ReportDetails";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function ReportPage() {
	const navigate = useNavigate();
	const [showMonth, setShowMonth] = useState(0);
	const [customStart, setCustomStart] = useState(new Date());
	const [customEnd, setCustomEnd] = useState(new Date());
	const [enabled, setEnabled] = useState(false);
	const [purchases, setPurchases] = useState([]);
	const [categories, setCategories] = useState([]);
	const [summary, setSummary] = useState({});
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		const currentDate = new Date();
		setShowMonth(currentDate.getMonth());
		setCustomStart(startOfMonth(currentDate));
		setCustomEnd(endOfMonth(currentDate));

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

	const getCurrentMonthly = () => {
		//TODO: Change year as well
		const currentDate = new Date();
		currentDate.setMonth(showMonth);
		const dateString = format(currentDate, "yyyy-MM-dd");
		const parsedDate = parseISO(dateString);
		const monthName = format(parsedDate, "MMMM yyyy");
		return monthName;
	};

	const setPreviousMonth = () => {
		if (showMonth === 0) {
			setShowMonth(11);
		} else {
			setShowMonth(showMonth - 1);
		}
	};
	const setNextMonth = () => {
		if (showMonth === 11) {
			setShowMonth(0);
		} else {
			setShowMonth(showMonth + 1);
		}
	};

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
		<div className="py-4 px-4 inline-block min-w-full align-middle">
			<header className="flex justify-between">
				<div className="">
					{!enabled && (
						<div className="text-2xl">
							{getCurrentMonthly()} <span onClick={setPreviousMonth}>Prev</span> |{" "}
							<span onClick={setNextMonth}>Next</span>
						</div>
					)}
					{enabled && (
						<>
							Start: <DatePicker selected={customStart} onChange={(date) => setCustomStart(date)} />
							End: <DatePicker selected={customEnd} onChange={(date) => setCustomEnd(date)} />
						</>
					)}
				</div>
				<div className="items-center">
					<Switch.Group as="div" className={"flex items-center flex-col sm:flex-row"}>
						<Switch.Label
							as="span"
							className={classNames(!enabled ? "font-semibold text-gray-500" : "text-gray-400", "md:mr-3 text-sm")}
						>
							<span>Monthly</span>
						</Switch.Label>
						<Switch
							checked={enabled}
							onChange={setEnabled}
							className={classNames(
								enabled ? "bg-zinc-400" : "bg-zinc-400",
								"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
							)}
						>
							<span
								aria-hidden="true"
								className={classNames(
									enabled ? "translate-x-5" : "translate-x-0",
									"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
								)}
							/>
						</Switch>
						<Switch.Label
							as="span"
							className={classNames(enabled ? "font-semibold text-gray-500" : "text-gray-400", "md:ml-3 text-sm ")}
						>
							<span>Custom</span>
						</Switch.Label>
					</Switch.Group>
				</div>
			</header>
			<main className="mt-8">
				<ReportSummary categories={categories} summary={summary} />
				<ReportDetails categories={categories} purchases={purchases} />
			</main>
		</div>
	);
}
