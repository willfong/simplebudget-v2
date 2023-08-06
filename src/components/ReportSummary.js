const people = [
	{ name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
	// More people...
];

export default function ReportSummary({ categories, summary }) {
	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<tbody className="divide-y divide-gray-200 bg-white">
									{categories.map((c) => (
										<tr key={c.id}>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
												{c.name}
											</td>
											<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
												{summary[c.id] ?? 0}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
