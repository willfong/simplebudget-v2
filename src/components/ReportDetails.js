import React from "react";
import { format } from "date-fns";

export default function SpendDetailPage({ purchases, categories }) {
	const categoriesLookup = categories.reduce((acc, c) => {
		acc[c.id] = c;
		return acc;
	}, {});
	return (
		<div className="p-2">
			<main className="px-4 py-2 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
					<div>
						<nav className="h-full overflow-y-auto mt-4">
							{Object.keys(purchases).map((day) => (
								<div key={day} className="relative">
									<div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
										<h3>{format(new Date(day), "EEE, MMM dd yyyy")}</h3>
									</div>
									<ul className="divide-y divide-gray-100">
										{purchases[day].map((item) => (
											<li key={item.id} className="flex gap-x-4 px-3 py-5">
												<div className="min-w-0 flex">
													<p className="text-gray-500">{format(item.date, "HH:MM")}</p>
													<p className="ml-2 text-gray-900">{item.amount}</p>
													<p className="ml-2 text-gray-900">{categoriesLookup[item.categoryId]["name"]}</p>
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