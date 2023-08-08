import React from "react";
import { format } from "date-fns";

export default function SpendDetailPage({ purchases, categories }) {
	const categoriesLookup = categories.reduce((acc, c) => {
		acc[c.id] = c;
		return acc;
	}, {});

	const dayTotals = Object.entries(purchases).reduce((result, [date, objectsArray]) => {
		const totalAmount = objectsArray.reduce((sum, obj) => sum + obj.amount, 0);
		result[date] = totalAmount;
		return result;
	}, {});

	return (
		<nav className="h-full overflow-y-auto mt-4">
			{Object.keys(purchases).map((day) => (
				<div key={day} className="relative">
					<div className="sticky top-0 bg-zinc-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 flex justify-between">
						<h3>{format(new Date(day), "EEE, MMM dd yyyy")}</h3>
						<div className="text-gray-500">Total: {dayTotals[day].toLocaleString()}</div>
					</div>
					<ul className="divide-y divide-gray-100">
						{purchases[day].map((item) => (
							<li key={item.id} className="flex gap-x-4 px-3 py-5 bg-white">
								<div className="flex-none flex gap-x-2 items-center">
									<p className="text-gray-500">{format(item.date, "HH:MM")}</p>
									<p className="text-gray-500">{categoriesLookup[item.categoryId]["name"]}</p>
								</div>
								<div className="flex-1 text-gray-500 overflow-hidden whitespace-nowrap">
									<p className="truncate">{item.message}</p>
								</div>
								<div className="flex-none flex-shrink-0 text-gray-900 text-right">{item.amount.toLocaleString()}</div>
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}
