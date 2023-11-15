import {getSupabaseClient} from "../index.tsx";
import {PostgrestError} from "@supabase/supabase-js";

export async function getTeams() {
    return getSupabaseClient()
        .from("teams")
        .select()
}
export async function getAllowedTeams() {
    return getSupabaseClient()
        .from("user_teams")
        .select()
}
export async function getInvites() {
    return getSupabaseClient()
        .from("invites")
        .select()
}
export async function getInvite(id: string) {
    return getSupabaseClient()
        .from("invites")
        .select()
        .eq("id",id)
        .limit(1)
        .single()
}
export async function rejectInvite(id: string) {

    return getSupabaseClient()
        .from("invites")
        .delete()
        .eq("id",id)
}
export async function acceptInvite(id: string): Promise<PostgrestError | string | null> {
    let { data, error } = await getInvite(id);
    if (error != null) {
        return error;
    }
    if (data == null) {
        return "An unexpected error occurred";
    }
    await getSupabaseClient()
        .from("user_teams")
        .insert({
            team_id: data.team_id,
            user_id: data.to_id
        })
        .eq("id",id)
    await getSupabaseClient()
        .from("invites")
        .delete()
        .eq("id",id)

    return null;
}
export async function getPartners(team_id: string) {
    return getSupabaseClient()
        .from("partners")
        .select()
        .eq("team_id", team_id);
}
export async function getPartner(partner_id: string) {
    return getSupabaseClient()
        .from("partners")
        .select()
        .eq("id", partner_id)
        .limit(1)
        .single()
}