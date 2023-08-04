import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import SpendPage from "./pages/Spend";
import ReportPage from "./pages/Report";
import SettingsPage from "./pages/Settings";
import Header from "./components/Header";

const routeList = [
	{ name: "Home", path: "/", component: HomePage },
	{ name: "Spend", path: "/spend", component: SpendPage },
	{ name: "Report", path: "/report", component: ReportPage },
	{ name: "Settings", path: "/settings", component: SettingsPage },
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
			<div className="min-h-full">
				<Header routeList={routeList} />
				<Routes>
					{routeList.map((route) => (
						<Route key={route.path} path={route.path} element={<route.component />} />
					))}
				</Routes>
			</div>
		</Router>
	);
}
