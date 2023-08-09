import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { deleteAllData } from "../idb";

export default function SettingsCategories() {
	const [deleteConfirm, setDeleteConfirm] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const handleSetDeleteConfirm = (event) => {
		setDeleteConfirm(event.target.value);
		setButtonDisabled(!(event.target.value.toLowerCase() === "confirm"));
	};

	const handleButton = async () => {
		await deleteAllData();
		// The below lines don't run due to some bug above
		setDeleteConfirm("");
		window.location.reload();
	};

	return (
		<div className="bg-white p-4">
			<h2 className="text-base font-semibold leading-7 text-gray-900">Reset</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">
				Clear all your data. Enter "confirm" in the textbox below. Refresh the page after (TODO...)
			</p>

			<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
				<div className="pt-6 flex flex-col sm:flex-row  items-center">
					<input
						className="flex-grow text-xl p-4 m-4 text-center"
						type="text"
						placeholder="Are you sure?"
						value={deleteConfirm}
						onChange={handleSetDeleteConfirm}
					/>

					<button
						type="button"
						disabled={buttonDisabled}
						onClick={handleButton}
						className={`sm:ml-auto inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
							buttonDisabled ? "bg-red-300 " : "bg-red-500"
						}`}
					>
						<TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
						Delete all data
					</button>
				</div>
			</dl>
		</div>
	);
}
