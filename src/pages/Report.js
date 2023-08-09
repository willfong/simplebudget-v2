import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { Switch } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { categoriesGetAll, purchasesGetByRange } from "../idb";
import ReportSummary from "../components/ReportSummary";
import ReportDetails from "../components/ReportDetails";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function ReportPage() {
	const navigate = useNavigate();
	const [showMonth, setShowMonth] = useState(new Date().getMonth());
	const [customStart, setCustomStart] = useState(startOfMonth(new Date()));
	const [customEnd, setCustomEnd] = useState(endOfMonth(new Date()));
	const [customRange, setCustomRange] = useState(false);
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

		const fetchPurchases = async () => {
			const data = await purchasesGetByRange(customStart, customEnd);
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

		Promise.all([fetchPurchases(), fetchCategories()]).then(() => {
			setDataLoaded(true);
		});
	}, [navigate, customStart, customEnd]);

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
		const currentDate = new Date();
		if (showMonth === 0) {
			setShowMonth(11);
			currentDate.setMonth(11);
		} else {
			setShowMonth(showMonth - 1);
			currentDate.setMonth(showMonth - 1);
		}
		setCustomStart(startOfMonth(currentDate));
		setCustomEnd(endOfMonth(currentDate));
	};
	const setNextMonth = () => {
		const currentDate = new Date();
		if (showMonth === 11) {
			setShowMonth(0);
			currentDate.setMonth(0);
		} else {
			setShowMonth(showMonth + 1);
			currentDate.setMonth(showMonth + 1);
		}
		setCustomStart(startOfMonth(currentDate));
		setCustomEnd(endOfMonth(currentDate));
	};

	const resetMonth = () => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth(); // Returns a zero-based index (0 for January, 1 for February, and so on).
		setShowMonth(currentMonth);
		setCustomStart(startOfMonth(currentDate));
		setCustomEnd(endOfMonth(currentDate));
	};

	const toggleCustomRange = (e) => {
		if (!e) {
			const currentDate = new Date();
			currentDate.setMonth(showMonth);
			setCustomStart(startOfMonth(currentDate));
			setCustomEnd(endOfMonth(currentDate));
		}
		setCustomRange(!customRange);
	};

	if (!dataLoaded) return null;

	return (
		<div className="py-4 px-4 inline-block min-w-full align-middle">
			<header className="flex space-x-8">
				<div className="flex-grow">
					{!customRange && (
						<div className="flex items-center">
							<span className="flex-shrink" onClick={setPreviousMonth}>
								<ArrowLeftIcon className="h-6 w-6 text-zinc-500" />
							</span>
							<span className="text-2xl text-center font-semibold flex-grow text-zinc-400" onClick={resetMonth}>
								{getCurrentMonthly()}
							</span>
							<span className="flex-shrink" onClick={setNextMonth}>
								<ArrowRightIcon className="h-6 w-6 text-zinc-500" />
							</span>
						</div>
					)}
					{customRange && (
						<>
							Start: <DatePicker selected={customStart} onChange={(date) => setCustomStart(date)} maxDate={customEnd} />
							End: <DatePicker selected={customEnd} onChange={(date) => setCustomEnd(date)} minDate={customStart} />
						</>
					)}
				</div>
				<div className="flex-shrink items-center">
					<Switch.Group as="div" className={"flex items-center flex-col sm:flex-row"}>
						<Switch.Label
							as="span"
							className={classNames(!customRange ? "font-semibold text-gray-500" : "text-gray-400", "md:mr-3 text-sm")}
						>
							<span>Monthly</span>
						</Switch.Label>
						<Switch
							checked={customRange}
							onChange={toggleCustomRange}
							className={classNames(
								customRange ? "bg-zinc-400" : "bg-zinc-400",
								"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
							)}
						>
							<span
								aria-hidden="true"
								className={classNames(
									customRange ? "translate-x-5" : "translate-x-0",
									"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
								)}
							/>
						</Switch>
						<Switch.Label
							as="span"
							className={classNames(customRange ? "font-semibold text-gray-500" : "text-gray-400", "md:ml-3 text-sm ")}
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
