import React, { useState } from "react";

export default function PlanIncome({ income, planDelete, planAdd, fetchPlan }) {
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [currency, setCurrency] = useState("");

	const handleAddButton = (e) => {
		e.preventDefault();
		planAdd({ type: "income", name, amount: parseFloat(amount), currency });
		setName("");
		setAmount("");
		setCurrency("");
		fetchPlan();
	};

	const handleDelete = async (id) => {
		await planDelete(id);
		fetchPlan();
	};

	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Income</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">Budget and track spending by category.</p>
			<div className="mt-8">
				<h3 className="text-lg font-semibold">Current Income Streams:</h3>
				<ul className="mt-2">
					{income.map((entry, index) => (
						<li key={index} className="mt-1 flex justify-between items-center">
							{entry.name}: {entry.amount} {entry.currency}
							<button onClick={() => handleDelete(entry.id)} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
			<form onSubmit={handleAddButton} className="mt-4">
				<div className="mt-4">
					<label htmlFor="currency" className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={name}
						placeholder="e.g., Salary"
						onChange={(e) => setName(e.target.value)}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div>
					<label htmlFor="amount" className="block text-sm font-medium text-gray-700">
						Amount
					</label>
					<input
						type="number"
						id="amount"
						name="amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="currency" className="block text-sm font-medium text-gray-700">
						Currency
					</label>
					<input
						type="text"
						id="currency"
						name="currency"
						value={currency}
						placeholder="e.g., USD, EUR, GBP"
						onChange={(e) => setCurrency(e.target.value)}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div className="mt-4">
					<button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
