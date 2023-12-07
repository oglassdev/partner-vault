import {getSupabaseClient} from "../index.tsx";
import {Database} from "../../database.types.ts";

export async function getPartners(teamId: string) {
    let { data, error } = await getSupabaseClient()
        .from('partners')
        .select(`
        *,
        partner_tags (
            *,
            tags (*)
        )
        `)
        .eq('team_id', teamId);

    if (error) throw error;
    return data;
}
export async function getPartner(partnerId: string) {
    let { data, error } = await getSupabaseClient()
        .from('partners')
        .select(`
        *,
        partner_tags (
            *,
            tags (*)
        )
        `)
        .eq('id', partnerId)
        .limit(1)
        .single();

    if (error) throw error;
    return data;
}
export async function createPartner(partner: Database['public']['Tables']['partners']['Insert']) {
    let { data, error } = await getSupabaseClient()
        .from('partners')
        .insert(partner)
        .select();
    if (error) throw error;
    return data;
}
export async function updatePartner(partner: Database['public']['Tables']['partners']['Update']) {
    if (partner.id == undefined) throw {
        message: "Partner ID was null!"
    }
    let { error } = await getSupabaseClient()
        .from('partners')
        .update(partner)
        .eq('id', partner.id);
    if (error) throw error;
}
export async function removePartner(partnerId: string) {
    let { error } = await getSupabaseClient()
        .from('partners')
        .delete()
        .eq('id',partnerId)
    if (error) throw error;
}
export async function deletePartnerTags(partnerId: string) {
    let { error } = await getSupabaseClient()
        .from('partner_tags')
        .delete()
        .eq("partner_id", partnerId)
    if (error) throw error;
}
export async function createPartnerTags(tags: {partner_id: string, tag_id: string}[]) {
    let { error } = await getSupabaseClient()
        .from('partner_tags')
        .insert(tags);
    if (error) throw error;
}
export async function removePartnerTags(partnerId: string, tagId: string) {
    let {error} = await getSupabaseClient()
        .from('partner_tags')
        .delete()
        .eq("partner_id", partnerId)
        .eq('tag_id', tagId);
    if (error) throw error;
}