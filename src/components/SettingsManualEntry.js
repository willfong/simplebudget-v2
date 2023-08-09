import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { categoriesGetAll, purchasesAdd } from "../idb";

export default function SettingsCategories() {
	const [amount, setAmount] = useState("");
	const [message, setMessage] = useState("");
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [startDate, setStartDate] = useState(new Date());

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const data = await categoriesGetAll();
		setCategories(data);
		setSelectedCategory(data[0]?.id);
	};

	const handleAddAmount = async () => {
		await purchasesAdd(selectedCategory, amount, startDate, message);
		setStartDate(new Date());
		setAmount("");
		setMessage("");
	};

	const handleAmountChange = (event) => {
		setAmount(event.target.value);
	};

	const handleMessageChange = (event) => {
		setMessage(event.target.value);
	};

	const handleCategoryChange = (event) => {
		setSelectedCategory(event.target.value);
	};

	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Manual Entry</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">Add a missing purchase.</p>

			<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
				<div className="flex flex-col space-y-6 my-2 lg:flex-row lg:items-center sm:space-y-0 sm:space-x-6">
					<DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="Pp" />
					<select
						id="category"
						name="category"
						onChange={handleCategoryChange}
						className="flex-grow mt-2 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300  text-lg sm:leading-6"
					>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
					<input
						className="flex-grow p-4 text-lg"
						type="tel"
						placeholder="Amount"
						value={amount}
						onChange={handleAmountChange}
					/>
					<input
						className="flex-grow p-4 text-lg"
						type="text"
						placeholder="Note (optional)"
						value={message}
						onChange={handleMessageChange}
					/>
					<button type="button" className="font-semibold text-lime-700" onClick={handleAddAmount}>
						Add
					</button>
				</div>
			</dl>
		</div>
	);
}
