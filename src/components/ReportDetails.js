import React from "react";
import { format } from "date-fns";

export default function SpendDetailPage({ purchases, categories }) {
	const categoriesLookup = categories.reduce((acc, c) => {
		acc[c.id] = c;
		return acc;
	}, {});

	const dayTotals = Object.entries(purchases).reduce((result, [date, objectsArray]) => {
		const totalAmount = objectsArray.reduce((sum, obj) => sum + parseFloat(obj.amount), 0);
		result[date] = totalAmount;
		return result;
	}, {});

	console.log(dayTotals);

	return (
		<main className="px-3 py-2 lg:flex-auto lg:px-0 lg:py-20">
			<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
				<div>
					<nav className="h-full overflow-y-auto mt-4">
						{Object.keys(purchases).map((day) => (
							<div key={day} className="relative">
								<div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 flex justify-between">
									<h3>{format(new Date(day), "EEE, MMM dd yyyy")}</h3>
									<div className="text-gray-500">Total: {dayTotals[day]}</div>
								</div>
								<ul className="divide-y divide-gray-100">
									{purchases[day].map((item) => (
										<li key={item.id} className="flex gap-x-4 px-3 py-5 bg-white">
											<div className="min-w-0 flex">
												<p className="text-gray-500">{format(item.date, "HH:MM")}</p>
												<p className="ml-2 text-gray-500">{categoriesLookup[item.categoryId]["name"]}</p>
												<p className="ml-2 text-gray-900">{item.amount}</p>
												<p className="ml-2 text-gray-500">{item.message}</p>
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
	);
}
