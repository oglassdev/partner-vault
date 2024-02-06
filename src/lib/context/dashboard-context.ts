import { createContext, ResourceReturn, useContext } from "solid-js";
import { Database } from "~/../database.types.ts";
import { Session } from "@supabase/supabase-js";

export type DashboardData = {
	authenticated_user: {
		session: ResourceReturn<Session | undefined>;
		profile: ResourceReturn<
			Database["public"]["Tables"]["profiles"]["Row"] | undefined
		>;
	};
	team: ResourceReturn<
		Database["public"]["Tables"]["teams"]["Row"] | undefined
	>;
	partners: ResourceReturn<Database["public"]["Tables"]["partners"]["Row"][]>;
	users: ResourceReturn<Database["public"]["Tables"]["profiles"]["Row"][]>;
	refresh_all: () => void;
};
const DashboardContext = createContext<DashboardData>();
export const DashboardProvider = DashboardContext.Provider;
export function useDashboardContext() {
	const value = useContext(DashboardContext);
	if (value === undefined) {
		throw new Error(
			"useDashboardContext must be used within a DashboardContext.Provider",
		);
	}
	return value;
}
