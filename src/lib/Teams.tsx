import {getSupabaseClient} from "../index.tsx";
import {Database} from "../../database.types.ts";

export async function getTeam(teamId: string) {
    let { data, error } = await getSupabaseClient()
        .from('teams')
        .select(`
            *,
            partners (
                *
            ),
            user_teams (
                *
            ),
            roles (
                *
            ),
            tags (
                *
            )
        `)
        .eq('id',teamId)
        .limit(1)
        .single()

    if (error) throw error;

    return data
}
export async function getTeams() {
    let { data, error } = await getSupabaseClient()
        .from('teams')
        .select(`
            *,
            partners (
              *
            ),
            user_teams(
              *
            ),
            roles (
              *
            )
        `);

    if (error) throw error;
    return data;
}
export async function updateTeam(teamId: string, update: Database["public"]["Tables"]["teams"]["Update"]) {
    let { error } = await getSupabaseClient()
        .from("teams")
        .update(update)
        .eq("id", teamId);

    if (error) throw error;
}
export async function getTeamInvites() {
    let { data, error } = await getSupabaseClient()
        .from('invites')
        .select(`
        *,
        teams!inner (
            *
        )
        `)
        .neq("from_id",(await getSupabaseClient().auth.getSession()).data.session?.user.id ?? "")
    if (error) throw error;
    console.log(data?.length)
    return data;
}
export async function acceptTeamInvite(teamId: string) {
    let { data: sessionData, error: sessionError } = await getSupabaseClient().auth.getSession();
    if (sessionError) throw sessionError;
    let userId = sessionData.session?.user?.id;
    if (!userId) throw "You are not logged in!";

    const { error } = await getSupabaseClient()
        .from('user_teams')
        .insert([{ team_id: teamId, user_id: userId }]);
    if (error) throw error;


    const { error: deletionError } = await getSupabaseClient()
        .from('invites')
        .delete()
        .eq("team_id",teamId);
    if (deletionError) throw error;
}
export async function rejectTeamInvite(inviteId: string) {
    let { error } = await getSupabaseClient()
        .from('invites')
        .delete()
        .eq('id', inviteId);
    if (error) throw error;
}
export async function createTeamInvite(toId: string, teamId: string) {
    let { data: sessionData, error: sessionError } = await getSupabaseClient().auth.getSession();
    if (sessionError) throw sessionError;
    let userId = sessionData.session?.user?.id;
    if (!userId) throw "You are not logged in!";

    let { error } = await getSupabaseClient()
        .from('invites')
        .insert([{ from_id: userId, to_id: toId, team_id: teamId }]);

    if (error) throw error;
}
export async function createTeam(name: string) {
    let { data: sessionData, error: sessionError } = await getSupabaseClient().auth.getSession();
    if (sessionError) throw sessionError;
    let userId = sessionData.session?.user?.id;
    if (!userId) throw "You are not logged in!";

    let { data, error } = await getSupabaseClient()
        .from('teams')
        .insert({ name: name, owner: userId })
        .select()
        .limit(1)
        .maybeSingle();

    if (error) throw error;

    let { error: utError } = await getSupabaseClient()
        .from('user_teams')
        .insert({ user_id: userId, team_id: data!.id })
    if (utError) throw utError;
}
export async function deleteTeam(teamId: string) {
    let { error } = await getSupabaseClient()
        .from('teams')
        .delete()
        .eq('id', teamId)

    if (error) throw error;
}
export async function leaveTeam(teamId: string) {
    let { error } = await getSupabaseClient()
        .from('user_teams')
        .delete()
        .eq('team_id',teamId);

    if (error) throw error;
}
