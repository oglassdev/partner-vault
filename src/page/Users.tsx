import {useParams} from "@solidjs/router";
import {createMemo, createResource, createSignal, For, Show, Suspense} from "solid-js";
import {Loader2, Plus, RefreshCcw} from "lucide-solid";
import {TransitionGroup} from "solid-transition-group";
import {getOtherUsers} from "../lib/User.tsx";
import {writeText} from "@tauri-apps/plugin-clipboard-manager";
import {toast} from "solid-toast";
import {getSupabaseClient} from "../index.tsx";
import {createTeamInvite} from "../lib/Teams.tsx";
import {createModal} from "../component/Modal.tsx";

export default function Users() {
    let teamId = useParams().teamId;
    const isOwner = async () => {
        let uid = (await getSupabaseClient().auth.getSession()).data.session?.user.id;
        if (uid == undefined) return false;

        let {data} = await getSupabaseClient().from('teams')
            .select("owner")
            .eq("id", teamId)
            .eq("owner", uid)
            .limit(1)
            .maybeSingle();
        return data != null
    }
    const [dbUsers, {refetch: refetchUsers}] = createResource(async () => await getOtherUsers(teamId))
    const [search, setSearch] = createSignal("");

    const users = createMemo(() => {
        return dbUsers()?.filter((user) => search() == null || user.username?.toLowerCase().includes(search().toLowerCase()))
    })

    const {modal, open} = createModal<{teamId: string}>((data, controller) => {
        const [input, setInput] = createSignal("");
        const invite = async () => {
            let {data, error} = await getSupabaseClient().from("profiles")
                .select()
                .eq("username", input())
                .limit(1)
                .maybeSingle();
            if (error || data == null) {
                toast.error("Could not find the user with that username!");
            }

            createTeamInvite(data!.id,teamId)
                .then(() => {
                    toast.success("Successfully invited " + data!.username)
                })
                .catch((err) => {
                    toast.error(err.message);
                })
        }
        return (
            <div onClick={(event) => {
                event.stopPropagation()
            }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg w-fit cursor-default m-auto dark:text-white p-2 flex flex-col gap-2"}>
                <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={input()}
                       onInput={(e) => {
                           setInput(e.target.value)
                       }
                       } placeholder={"Username"} />
                <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2"} onClick={invite}>Invite</button>
            </div>
        )
    }, {teamId});

    return <div class={"w-full h-full p-4 flex flex-col gap-2 dark:bg-gray-800 dark:text-white"}>
        <div class={"flex flex-row gap-2"}>
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
                    refetchUsers()
                }}
            >
                <RefreshCcw class={"m-auto"}/>
            </button>
            <Show when={isOwner()}>
                <button
                    class={"flex-none p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"}
                    onClick={() => {
                        open({teamId});
                    }}
                >
                    <Plus class={"m-auto"}/>
                </button>
            </Show>
        </div>
        <Suspense fallback={<Loader2 class={"animate-spin m-auto"} size={40}/>}>
            <div class={"h-fit gap-2 rounded-lg overflow-auto overscroll-auto flex flex-wrap"}>
                <Show when={dbUsers()?.length == 0}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No users found.
                    </div>
                </Show>
                <Show when={users()?.length == 0 && dbUsers()?.length != 0}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No users found matching the criteria.
                    </div>
                </Show>
                <TransitionGroup
                    onEnter={(el, done) => {
                        const a = el.animate([{opacity: 0}, {opacity: 1}], {
                            duration: 200
                        });
                        a.finished.then(done);
                    }}
                    onExit={(_el, done) => {
                        done();
                    }}>
                    <For each={users()}>
                        {(user) => {
                            return <button
                                class={"w-60 h-36 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex flex-col hover:bg-gray-200 dark:hover:bg-gray-600 leading-5"}
                                onClick={async () => {
                                    if (user.public_email) await writeText(user.public_email).then(() => {
                                        toast.success("Copied email to clipboard!")
                                    })
                                }}
                            >
                                <h4 class={"font-medium text-3xl mb-auto"}>{user.username}</h4>
                                <h4 class={"text-md text-gray-700 dark:text-gray-200"}>{user.public_email ?? "No public email."}</h4>
                                <h4 class={"text-sm text-gray-500 dark:text-gray-400 text-left"}>{user.id}</h4>
                            </button>
                        }}
                    </For>
                </TransitionGroup>
            </div>
        </Suspense>
        {modal()}
    </div>
}
