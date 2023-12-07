
import {createResource, For, Suspense} from "solid-js";
import {A, useParams} from "@solidjs/router";
import {Bookmark, BookUser, Loader2, Users} from "lucide-solid";
import {getTeam} from "../lib/Teams.tsx";
import {getDate} from "../lib/DateUtil.tsx";
import { fetch } from "@tauri-apps/plugin-http";
import {getSupabaseClient} from "../index.tsx";
import {toast} from "solid-toast";

export default function Dashboard() {
    let teamId = useParams().teamId;
    const [team] = createResource(async () => await getTeam(teamId));
    return <Suspense fallback={<Loader2 class={"animate-spin m-auto text-white"} size={36} />}><div class={"w-full h-full p-4 grid gap-2 grid-cols-2 auto-rows-fr dark:bg-gray-800"}>
        <div class={"card-default col-span-2 p-3 flex flex-col text-black dark:text-white"}>
            <h2 class={"text-4xl font-semibold"}>Team Overview</h2>
            <div class={"flex-auto flex flex-col"}>
                <div class={"flex-auto flex flex-row"}>
                    <div class={"flex-auto text-center items-center justify-center my-auto"}>
                        <BookUser class={"mx-auto pb-2"} size={70} strokeWidth={1.5} />
                        <h4 class={"text-2xl"}>{team()?.partners.length} partner(s)</h4>
                    </div>
                    <div class={"flex-auto text-center items-center justify-center my-auto"}>
                        <Users class={"mx-auto pb-2"} size={70} strokeWidth={1.5} />
                        <h4 class={"text-2xl"}>{team()?.user_teams.length} users(s)</h4>
                    </div>
                    <div class={"flex-auto text-center items-center justify-center my-auto"}>
                        <Bookmark class={"mx-auto pb-2"} size={70} strokeWidth={1.5} />
                        <h4 class={"text-2xl"}>{team()?.tags.length} tags(s)</h4>
                    </div>
                </div>
                    <button class={"rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 p-2 text-2xl font-medium"} onClick={async () => {
                        let toastId = toast.loading("Generating a detailed report");
                        let response = await fetch(
                            'https://jmdvrevzgaryrzhlzpgd.supabase.co/functions/v1/report_email', {
                                method: "POST",
                                body: JSON.stringify({
                                    teamId: teamId
                                }),
                                connectTimeout: 5,
                                headers: {
                                    "Authorization": `Bearer ${(await getSupabaseClient().auth.getSession()).data.session?.access_token}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        );
                        toast.remove(toastId);
                        if (!response.ok) {
                            toast.error(response.statusText);
                            return;
                        }
                        toast.success("Check your email for the report!");
                    }}>Generate a report</button>
            </div>
        </div>

        <div class={"card-default p-3 text-black dark:text-white flex flex-col overflow-auto gap-1"}>
            <h4 class={"text-3xl font-semibold"}>New partners</h4>
            <For each={team()?.partners.sort(partner => -getDate(partner.created_at).getMilliseconds()).slice(0,10)}>
                {(partner) => (
                    <A href={`/teams/${teamId}/partners`} class={"text-2xl font-medium py-1 px-2 hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200"}>
                        {partner.name}
                    </A>
                )}
            </For>
        </div>
        <div class={"card-default p-3 text-black dark:text-white flex flex-col overflow-auto gap-1"}>
            <h4 class={"text-3xl font-semibold"}>New tags</h4>
                <For each={team()?.tags.sort(tags => -getDate(tags.created_at).getMilliseconds()).slice(0,10)}>
                    {(partner) => (
                        <A href={`/teams/${teamId}/tags`} class={"text-2xl font-medium py-1 px-2 hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200"}>
                            {partner.name}
                        </A>
                    )}
                </For>
        </div>
    </div>
    </Suspense>
}
