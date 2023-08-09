import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import HomePage from "./pages/Home";
import SpendPage from "./pages/Spend";
import SpendDetailPage from "./pages/SpendDetail";
import ReportPage from "./pages/Report";
import SettingsPage from "./pages/Settings";
import Header from "./components/Header";

const routeList = [
	{ name: "Home", path: "/", component: SpendPage, nav: true },
	{ name: "Spend", path: "/spend", component: SpendPage, nav: true },
	{ name: "SpendDetail", path: "/spend/:id", component: SpendDetailPage, nav: false },
	{ name: "Report", path: "/report", component: ReportPage, nav: true },
	{ name: "Settings", path: "/settings", component: SettingsPage, nav: true },
];

export default function App() {
	return (
		<Router>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
			<div className="min-h-full flex flex-col">
				<Header routeList={routeList} />
				<div>
					<Routes>
						{routeList.map((route) => (
							<Route key={route.path} path={route.path} element={<route.component />} />
						))}
					</Routes>
				</div>
			</div>
		</Router>
	);
}
