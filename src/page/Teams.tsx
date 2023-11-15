import Footer from "../component/Footer.tsx";
import {createEffect, createResource, For} from "solid-js";
import {getPartners, getTeams} from "../lib/Database.tsx";
import {getSupabaseClient} from "../index.tsx";
import {A, useNavigate} from "@solidjs/router";
import {toast} from "solid-toast";

export default function Teams() {
    let [teams,] = createResource(getTeams);
    let navigate = useNavigate();
    createEffect(async () => {
        let {data} = await getSupabaseClient().auth.getSession();
        if (data?.session == null) {
            toast.error("You are not logged in!", {
                id: "notSignedIn",
            });
            navigate("/")
        }
    })
    return <div class={"flex h-screen w-full overflow-clip"}>
        <div class={"m-auto overflow-auto overscroll-y-auto"}>
            <div>{teams()?.statusText}</div>
            <For each={teams()?.data}>
                {(team) => {
                    let [partners,] = createResource(async () => getPartners(team.id));

                    return <div class={"bg-gray-200 w-64 h-80 rounded-lg px-4 py-2 flex flex-col"}>
                        <h1 class={"text-3xl font-semibold"}>{team.name}</h1>
                        <h3 class={"text-xs text-gray-500"}>{team.id}</h3>
                        <h4>{partners()?.data?.length} partner(s)</h4>
                        <span class={"my-auto"}></span>
                        <A href={`/teams/${team.id}`}>
                            <div class={"text-center w-full h-8 bg-blue-500 rounded-lg hover:bg-blue-600 text-white items-center"}>
                                View Team
                            </div>
                        </A>
                    </div>
                }}
            </For>
        </div>
        <Footer showLeave={true} showUsername={true} />
    </div>
}