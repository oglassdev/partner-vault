import {createResource, Resource, ResourceReturn} from "solid-js";
import {getSupabaseClient} from "../index.tsx";
import {Session} from "@supabase/supabase-js";
import {Database} from "../../database.types.ts";
import {getTeam} from "./Teams.tsx";
import {Params, useParams} from "@solidjs/router";

export type BaseRouteData = {
    params: Params,
    session: ResourceReturn<Session | null>
}
export type TeamRouteData = BaseRouteData & {
    teamData: ResourceReturn<Database["public"]["Tables"]["teams"]["Row"] | null>,
}
export type PartnersRouteData = TeamRouteData & {
    partners: ResourceReturn<{ partner: Database["public"]["Tables"]["partners"], tags: Database["public"]["Tables"]["tags"] }[]>
}
export function getBaseRouteData(): BaseRouteData {
    return {
        params: useParams(),
        session: createResource(async () => {
            let {data, error} = (await getSupabaseClient().auth.getSession());
            if (error) throw error;
            return data.session;
        })
    }
}
export function getTeamRouteData(): TeamRouteData {
    let baseRouteData = getBaseRouteData();
    return {
        ...baseRouteData,
        teamData: createResource(async () => {
            return await getTeam(baseRouteData.params.teamId)
        })
    }
}
export function getPartner