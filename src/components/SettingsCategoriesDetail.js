export default function SettingsCategoriesDetails({ name, budget, monthly }) {
	return (
		<div className="pt-6 sm:flex">
			<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{name}</dt>
			<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
				<div className="text-gray-900">{budget ? budget.toLocaleString() : ""}</div>
				<div className="text-gray-900">{budget ? (monthly ? "Monthly" : "Daily") : ""}</div>
				<button type="button" className="font-semibold text-lime-700 ">
					Update
				</button>
			</dd>
		</div>
	);
}
