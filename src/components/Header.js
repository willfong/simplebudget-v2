import React from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navigation({ routeList }) {
	return (
		<Disclosure as="nav" className="bg-lime-800">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex">
								<div className="flex flex-shrink-0 items-center text-amber-400 font-semibold tracking-widest">
									SimpleBudget
								</div>
								<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
									{routeList.map(
										(item) =>
											item.nav && (
												<Link
													key={item.name}
													to={item.path}
													className="border-transparent text-slate-200 inline-flex items-center border-b-2 px-1 pt-1"
													aria-current={item.current ? "page" : undefined}
												>
													{item.name}
												</Link>
											)
									)}
								</div>
							</div>
							<div className="hidden sm:ml-6 sm:flex sm:items-center">
								<button
									type="button"
									className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<span className="absolute -inset-1.5" />
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div className="-mr-2 flex items-center sm:hidden">
								{/* Mobile menu button */}
								<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 pb-3 pt-2">
							{routeList.map(
								(item) =>
									item.nav && (
										<Disclosure.Button
											key={item.name}
											as={Link}
											to={item.path}
											className="border-transparent text-slate-200  block border-l-4 py-2 pl-3 pr-4 text-base"
											aria-current={item.current ? "page" : undefined}
										>
											{item.name}
										</Disclosure.Button>
									)
							)}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
