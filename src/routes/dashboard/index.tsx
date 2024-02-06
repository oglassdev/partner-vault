import { useDashboardContext } from "~/lib/context/dashboard-context";
import { useSupabaseContext } from "~/lib/context/supabase-context.ts";

export default function Dashboard() {
	const {
		team: [team, teamActions],
		users: [users, usersActions],
		partners: [partners, partnersActions],
	} = useDashboardContext();

	return (
		<main class="p-4">
			<div>{team()?.name}</div>
		</main>
	);
}
