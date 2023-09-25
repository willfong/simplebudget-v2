import React, { useState, useEffect } from "react";
import { planGetAll, planAdd, planDelete, settingsGet, currencyGetAll } from "../idb";
import Summary from "../components/PlanSummary";
import Income from "../components/PlanIncome";
import Expenses from "../components/PlanExpenses";

export default function PlanPage() {
	const [income, setIncome] = useState([]);
	const [expense, setExpense] = useState([]);
	const [summaryIncome, setSummaryIncome] = useState(0);
	const [summaryExpenses, setSummaryExpenses] = useState(0);
	const [defaultCurrency, setDefaultCurrency] = useState("");
	const [currencies, setCurrencies] = useState({});

	useEffect(() => {
		fetchPlan();
	}, []);

	const fetchPlan = async () => {
		const fetchSettings = async () => {
			const settings = await settingsGet();
			setDefaultCurrency(settings.defaultCurrency || "");
		};
		fetchSettings();
		const fetchCurrencies = async () => {
			const currencies = await currencyGetAll();
			setCurrencies(currencies || {});
		};
		fetchCurrencies();
		const plan = await planGetAll();
		const income = plan.filter((i) => i.type === "income");
		const expense = plan.filter((i) => i.type === "expense");
		setSummaryIncome(
			income.reduce((total, i) => {
				if (i.currency === defaultCurrency) {
					return total + i.amount;
				} else {
					const conversionRate = currencies[i.currency];
					if (conversionRate) {
						return total + i.amount / conversionRate;
					} else {
						console.warn(`No conversion rate available for currency: ${i.currency}`);
						return total; // Return the accumulated total without any addition if no conversion rate is found
					}
				}
			}, 0)
		);
		setSummaryExpenses(
			expense.reduce((total, e) => {
				console.log(e);
				if (e.currency === defaultCurrency) {
					return total + e.amount;
				} else {
					const conversionRate = currencies[e.currency];
					if (conversionRate) {
						return total + e.amount / conversionRate;
					} else {
						console.warn(`No conversion rate available for currency: ${e.currency}`);
						return total; // Return the accumulated total without any addition if no conversion rate is found
					}
				}
			}, 0)
		);
		setIncome(income);
		setExpense(expense);
	};

	return (
		<div className="p-2">
			<main className="px-4 py-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-8 sm:space-y-20 lg:mx-0 lg:max-w-none ">
					<Summary income={summaryIncome} expenses={summaryExpenses} />
					<Income income={income} planDelete={planDelete} planAdd={planAdd} fetchPlan={fetchPlan} />
					<Expenses expense={expense} planDelete={planDelete} planAdd={planAdd} fetchPlan={fetchPlan} />
				</div>
			</main>
		</div>
	);
}
