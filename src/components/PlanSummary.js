export default function PlanSummary({ income, expenses }) {
	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Summary</h2>
			<h2 className="text-base font-semibold leading-7 text-gray-900">Income: {income.toLocaleString()}</h2>
			<h2 className="text-base font-semibold leading-7 text-gray-900">Expenses: {expenses.toLocaleString()}</h2>
			<h2 className="text-base font-semibold leading-7 text-gray-900">Total: {(income - expenses).toLocaleString()}</h2>
		</div>
	);
}
