export default function SettingsCategoriesDetails({ name, budget }) {
	return (
		<div className="pt-6 sm:flex">
			<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{name}</dt>
			<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
				<div className="text-gray-900">{budget ? budget.toLocaleString() : ""}</div>
				<button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
					Update
				</button>
			</dd>
		</div>
	);
}
