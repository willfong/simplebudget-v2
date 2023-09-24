import React, { useState, useEffect } from "react";
import { dataExport, dataImport } from "../idb";

export default function SettingsDataManagement() {
	const [inputBox, setInputBox] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const data = await dataExport();
		setInputBox(data);
	};

	const handleImport = async () => {
		dataImport(inputBox);
		console.log("Imported");
		fetchData();
	};

	const handleInputChange = (event) => {
		setInputBox(event.target.value);
	};

	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Data Management</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">This is your data</p>

			<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
				<div>
					<label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
						Value
					</label>
					<div className="mt-2">
						<textarea
							rows={4}
							name="comment"
							id="comment"
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							value={inputBox}
							onChange={handleInputChange}
						/>
					</div>
					<button
						type="button"
						onClick={handleImport}
						className={`sm:ml-auto inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm `}
					>
						Import
					</button>
				</div>
			</dl>
		</div>
	);
}
