import Footer from "../component/Footer.tsx";
import {createEffect, createMemo, createResource, createSignal, For, Show, Suspense} from "solid-js";
import {getSupabaseClient} from "../index.tsx";
import {A, useNavigate} from "@solidjs/router";
import {toast} from "solid-toast";
import {acceptTeamInvite, createTeam, getTeamInvites, getTeams} from "../lib/Teams.tsx";
import {Loader2, Plus, RefreshCcw} from "lucide-solid";
import {createModal} from "../component/Modal.tsx";

export default function Teams() {
    let [dbTeams, {refetch: refetchTeams}] = createResource(getTeams);
    let [invites, {refetch: refetchInvites}] = createResource(getTeamInvites);
    let navigate = useNavigate();

    let [search, setSearch] = createSignal("");
    createEffect(async () => {
        let {data} = await getSupabaseClient().auth.getSession();
        if (data?.session == null) {
            toast.error("You are not logged in!", {
                id: "notSignedIn",
            });
            navigate("/")
        }
    })
    let teams = createMemo(() => dbTeams()?.filter((team) => team.name.includes(search()) && !invites()?.map((invite) => invite.team_id).includes(team.id)));
    const {modal, open} = createModal<{}>((_, controller) => {
        const [teamName, setTeamName] = createSignal("");
        const invite = async () => {
            createTeam(teamName())
                .then(() => {
                    toast.success("Successfully created " + teamName());
                    refetchTeams();
                    controller.close()
                })
                .catch((err) => {
                    toast.error(err.message);
                })
        }
        return (
            <div onClick={(event) => {
                event.stopPropagation()
            }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg w-fit cursor-default m-auto dark:text-white p-2 flex flex-col gap-2"}>
                <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={teamName()}
                       onInput={(e) => {
                           setTeamName(e.target.value)
                       }
                       } placeholder={"Name"} />
                <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2"} onClick={invite}>Create</button>
            </div>
        )
    }, {});
    return <div class={"flex h-full w-full dark:bg-gray-800 pt-8 flex-col dark:text-white gap-2"}>
        <div class={"flex flex-row gap-2 mx-4"}>
            <input
                class={"flex-auto rounded-lg py-1 px-3 bg-gray-200 dark:bg-gray-700 dark:text-white text-lg"}
                placeholder={"Search"}
                onInput={(e) => {
                    setSearch(e.target.value);
                }}
            />
            <button
                class={"flex-none p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"}
                onClick={() => {
                    refetchTeams()
                    refetchInvites()
                }}
            >
                <RefreshCcw class={"m-auto"}/>
            </button>
            <button
                class={"flex-none p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"}
                onClick={() => {
                    open({});
                }}
            >
                <Plus class={"m-auto"}/>
            </button>
        </div>
        <Suspense fallback={<Loader2 class={"animate-spin m-auto"} size={40}/>}>
            <div class={"overflow-auto overscroll-y-auto flex flex-row gap-2 mx-4"}>
                <Show when={dbTeams()?.length == 0 && !(invites()?.length != 0)}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No teams found. <button onClick={open}>Create one?</button>
                    </div>
                </Show>
                <Show when={teams()?.length == 0 && dbTeams()?.length != 0 && !(invites()?.length != 0)}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No teams found matching the criteria.
                    </div>
                </Show>
                    <For each={teams()}>
                        {(team) => {
                            return <div
                                class={"bg-gray-200 dark:bg-gray-700 w-64 h-48 rounded-lg p-3 flex flex-col"}>
                                <h1 class={"text-3xl font-semibold leading-8"}>{team.name}</h1>
                                <h3 class={"text-xs text-gray-500"}>{team.id}</h3>
                                <h4 class={"text-xl font-medium"}>{team.partners.length} partner{(team.partners.length != 1) ? "s" : ""}</h4>
                                <span class={"my-auto"}></span>
                                <A href={`/teams/${team.id}/`}>
                                    <div
                                        class={"text-center w-full h-8 bg-blue-500 rounded-lg hover:bg-blue-600 text-white flex"}>
                                    <span class={"m-auto"}>
                                    View Team
                                    </span>
                                    </div>
                                </A>
                            </div>
                        }}
                    </For>
                    <For each={invites()}>
                        {(invite) => (
                            <div
                                class={"bg-gray-200 dark:bg-gray-700 w-64 h-48 rounded-lg p-3 flex flex-col"}>
                                <h1 class={"text-3xl font-medium"}>{invite.teams?.name}</h1>
                                <h1 class={"text-2xl text-gray-400"}>Team invite</h1>
                                <button class={"text-center w-full h-8 bg-blue-500 rounded-lg hover:bg-blue-600 text-white mt-auto"} onClick={async () => {
                                    await acceptTeamInvite(invite.team_id);
                                    refetchTeams();
                                    refetchInvites();
                                }}>Accept</button>
                            </div>
                        )}
                    </For>
            </div>
        </Suspense>
        <Footer showLeave={true} showUsername={true}/>
        {modal()}
    </div>
}
