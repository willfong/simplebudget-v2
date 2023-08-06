import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { categoriesGetAll } from "../idb";

export default function SpendPage() {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		fetchCategories();
		const scrollToTop = () => {
			window.scrollTo(0, 0); // Scroll to the top of the window (x: 0, y: 0)
		};
		window.addEventListener("scroll", scrollToTop);
		return () => {
			window.removeEventListener("scroll", scrollToTop);
		};
	}, []);

	const fetchCategories = async () => {
		const data = await categoriesGetAll();
		if (data.length === 0) {
			navigate("/settings");
		}
		setCategories(data);
	};

	return (
		<ul className="divide-y divide-gray-100">
			{categories.map((c) => (
				<li key={c.id} className="relative flex justify-between gap-x-6 px-4 py-8 hover:bg-gray-50 sm:px-6 lg:px-8">
					<div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
						<div className="min-w-0 flex-auto">
							<p className="text-lg font-semibold leading-6 text-gray-900">
								<Link to={`/spend/${c.id}`}>
									<span className="absolute inset-x-0 -top-px bottom-0" />
									{c.name}
								</Link>
							</p>
						</div>
					</div>
					<div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
						<div className="sm:block">
							<p className="mt-1 text-xs leading-5 text-gray-500">{c.budget}</p>
						</div>
						<ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
					</div>
				</li>
			))}
		</ul>
	);
}
