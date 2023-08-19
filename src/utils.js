import { getDaysInMonth } from "date-fns";

export const monthlyBudget = (categories) => {
	const dailyBudget = categories.reduce((acc, cur) => {
		if (!cur.monthly) {
			acc += cur.budget;
		}
		return acc;
	}, 0);
	const monthlyBudget = categories.reduce((acc, cur) => {
		if (cur.monthly) {
			acc += cur.budget;
		}
		return acc;
	}, 0);
	const date = new Date();
	const daysInMonth = getDaysInMonth(date);
	return Math.round(monthlyBudget + dailyBudget * daysInMonth).toLocaleString();
};

export const dailyBudget = (categories) => {
	const dailyBudget = categories.reduce((acc, cur) => {
		if (!cur.monthly) {
			acc += cur.budget;
		}
		return acc;
	}, 0);
	const monthlyBudget = categories.reduce((acc, cur) => {
		if (cur.monthly) {
			acc += cur.budget;
		}
		return acc;
	}, 0);
	const date = new Date();
	const daysInMonth = getDaysInMonth(date);
	return Math.round(dailyBudget + monthlyBudget / daysInMonth).toLocaleString();
};
