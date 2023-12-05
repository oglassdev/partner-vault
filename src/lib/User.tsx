import {Database} from "../../database.types.ts";
import {getSupabaseClient} from "../index.tsx";

export async function getSession() {
    let { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw error;
    return data
}
export async function getOtherUsers(teamId: string) {
    let { data, error } = await getSupabaseClient()
        .from('profiles')
        .select(`
        *,
        user_teams!inner(
            user_id
        )
        `)
        .in('user_teams.team_id', [teamId]);

    if (error) throw error;

    return data;
}
export async function updateOtherUser(userTeams: Database["public"]['Tables']['user_teams']['Update']) {
    let { error } = await getSupabaseClient()
        .from('user_teams')
        .update(userTeams)

    if (error) throw error;
}
export async function kickUserFromTeam(teamId: string, userId: string) {
    let { error } = await getSupabaseClient()
        .from('user_teams')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

    if (error) throw error;
}
