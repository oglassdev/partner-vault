import {createContext, Resource, useContext} from "solid-js";
import {Database} from "~/../database.types.ts";
import {Session} from "@supabase/supabase-js";

type DashboardData = {
    authenticated_user: {
        session: Resource<Session>,
        profile: Resource<Database["public"]["Tables"]["profiles"]["Row"]>
    }
    team: Resource<Database["public"]["Tables"]["teams"]["Row"]>
    partners: Resource<Database["public"]["Tables"]["partners"]["Row"][]>
    users: Resource<Database["public"]["Tables"]["profiles"]["Row"][]>
}
const DashboardContext = createContext<DashboardData>()
export const DashboardProvider = DashboardContext.Provider
export function useDashboardContext() {
    const value = useContext(DashboardContext);
    if (value == undefined) {
        throw new Error("useDashboardContext must be used within a DashboardContext.Provider");
    }
    return value
}