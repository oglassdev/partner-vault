import {getSupabaseClient} from "../index.tsx";
import {Database} from "../../database.types.ts";

export async function createTag(tag: Database['public']['Tables']['tags']['Insert']) {
    let { error } = await getSupabaseClient()
        .from('tags')
        .insert(tag);
    if (error) throw error;
}
export async function getTag(tagId: string) {
    let { data, error } = await getSupabaseClient()
        .from('tags')
        .select()
        .eq('team_id', tagId)
        .limit(1)
        .single();
    if (error) throw error;

    return data;
}
export async function getTeamTags(teamId: string) {
    let { data, error } = await getSupabaseClient()
        .from('tags')
        .select()
        .eq('team_id', teamId);
    if (error) throw error;

    return data;
}
export async function deleteTag(tagId: string) {
    let { error } = await getSupabaseClient()
        .from('tags')
        .delete()
        .eq('id', tagId);
    if (error) throw error;
}
export async function updateTag(tag: Database['public']['Tables']['tags']['Update']) {
    let { error } = await getSupabaseClient()
        .from('tags')
        .update(tag)
        .eq('id',tag.id!);
    if (error) throw error;
}