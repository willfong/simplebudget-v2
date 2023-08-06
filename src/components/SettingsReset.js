import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/20/solid";
import { deleteAllData } from "../idb";

export default function SettingsCategories() {
	const [deleteConfirm, setDeleteConfirm] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const navigate = useNavigate();

	const handleSetDeleteConfirm = (event) => {
		setDeleteConfirm(event.target.value);
		setButtonDisabled(!(event.target.value === "confirm"));
	};

	const handleButton = async () => {
		await deleteAllData();
		setDeleteConfirm("");
		navigate("/");
	};

	return (
		<div>
			<h2 className="text-base font-semibold leading-7 text-gray-900">Reset</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">
				Clear all your data. Enter "confirm" in the textbox below. Refresh the page after (TODO...)
			</p>

			<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
				<div className="pt-6 sm:flex">
					<dt className="sm:w-64 sm:flex-none sm:pr-6">
						<input type="text" placeholder="Are you sure?" value={deleteConfirm} onChange={handleSetDeleteConfirm} />
					</dt>
					<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
						<button
							type="button"
							disabled={buttonDisabled}
							onClick={handleButton}
							className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
								buttonDisabled ? "bg-red-300 " : "bg-red-500"
							}`}
						>
							<TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
							Delete all data
						</button>
					</dd>
				</div>
			</dl>
		</div>
	);
}
