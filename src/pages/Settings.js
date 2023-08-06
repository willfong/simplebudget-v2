import Categories from "../components/SettingsCategories";
import Reset from "../components/SettingsReset";

export default function SettingsPage() {
	return (
		<div className="p-2">
			<main className="px-4 py-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
				<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
					<Categories />
					<Reset />
				</div>
			</main>
		</div>
	);
}
