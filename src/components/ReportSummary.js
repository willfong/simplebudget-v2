import { monthlyBudget } from "../utils";

export default function ReportSummary({ categories, summary }) {
	const grandTotal = Object.values(summary).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	return (
		<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
			<table className="min-w-full divide-y divide-gray-300">
				<tbody className="divide-y divide-gray-200 bg-white">
					{categories.map((c) => (
						<tr key={c.id}>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-700 sm:pl-6">{c.name}</td>
							<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-gray-700 text-sm sm:pr-6">
								{summary[c.id]?.toLocaleString() ?? 0}
							</td>
						</tr>
					))}
					<tr key="grandTotal">
						<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">Total</td>
						<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-900 sm:pr-6">
							{grandTotal.toLocaleString()}
						</td>
					</tr>
					<tr key="monthlyBudget">
						<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">Budget</td>
						<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-900 sm:pr-6">
							{monthlyBudget(categories).toLocaleString()}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
