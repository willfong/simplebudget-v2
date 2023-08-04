/*


export default function App() {
	return (

	);
}


*/
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import SpendPage from "./pages/Spend";
import ReportPage from "./pages/Report";
import SettingsPage from "./pages/Settings";
import Header from "./components/Header";

export default function Example() {
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
				<Header />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/spend" element={<SpendPage />} />
					<Route path="/report" element={<ReportPage />} />
					<Route path="/settings" element={<SettingsPage />} />
				</Routes>
			</div>
		</Router>
	);
}
