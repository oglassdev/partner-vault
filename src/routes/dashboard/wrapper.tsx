import { Outlet, useParams } from "@solidjs/router";
import { createResource } from "solid-js";
import { showToast } from "~/components/ui/toast";
import {
	DashboardData,
	DashboardProvider,
} from "~/lib/context/dashboard-context";
import { useSupabaseContext } from "~/lib/context/supabase-context";

export default function DashboardWrapper() {
	const supabase = useSupabaseContext();
	const team_id = useParams().team_id;

	const sessionResource = createResource(async () => {
		const { data, error } = await supabase.auth.getSession();
		if (error) showErrorToast(error.name, error.message);
		return data?.session ?? undefined;
	});
	const profile = createResource(async () => {
		const session = sessionResource[0]();
		if (session == null) {
			showErrorToast("Invalid Session", "Please log back in.");
			return undefined;
		}

		const { data, error } = await supabase
			.from("profiles")
			.select()
			.eq("id", session?.user.id)
			.limit(1)
			.single();

		if (error) showErrorToast(error.code, error.message);

		return data ?? undefined;
	});

	const team = createResource(async () => {
		const { data, error } = await supabase
			.from("teams")
			.select()
			.eq("id", team_id)
			.limit(1)
			.single();

		if (error) showErrorToast(error.code, error.message);

		return data ?? undefined;
	});
	const partners = createResource(async () => {
		const { data, error } = await supabase
			.from("partners")
			.select()
			.eq("team_id", team_id);
		if (error) showErrorToast(error.code, error.message);

		return data ?? [];
	});

	const users = createResource(async () => {
		const { data, error } = await supabase
			.from("user_teams")
			.select(`
        *,
        profiles!inner(*)
      `)
			.eq("team_id", team_id);
		if (error) showErrorToast(error.code, error.message);

		return (
			data?.flatMap((user_teams) => {
				const profile = user_teams.profiles;
				return profile ? [profile] : [];
			}) ?? []
		);
	});

	const dashboard: DashboardData = {
		authenticated_user: {
			session: sessionResource,
			profile,
		},
		team,
		partners,
		users,
		refresh_all() {
			this.authenticated_user.profile[1].refetch();
			this.authenticated_user.session[1].refetch();
			this.team[1].refetch();
			this.partners[1].refetch();
			this.users[1].refetch();
		},
	};
	return (
		<DashboardProvider value={dashboard}>
			<Outlet />
		</DashboardProvider>
	);
}

function showErrorToast(name: string, description: string) {
	showToast({
		variant: "destructive",
		title: `Error: ${name}`,
		description: description,
	});
}
