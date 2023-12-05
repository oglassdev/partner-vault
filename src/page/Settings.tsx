import {createSignal, createResource, Suspense, Show, createMemo} from "solid-js";
import Toggle, {DefaultToggleStyle} from "../component/Toggle.tsx";
import {getSupabaseClient} from "../index.tsx";
import {useParams} from "@solidjs/router";
import {Check, Loader2} from "lucide-solid";
import {updateTeam} from "../lib/Teams.tsx";
import {toast} from "solid-toast";
import {getSession} from "../lib/User.tsx";

export default function Settings() {
    const teamId = useParams().teamId
    const [teamData] = createResource(async () => {
        let { data, error } = await getSupabaseClient()
            .from("teams")
            .select("name, owner")
            .eq("id", teamId)
            .limit(1)
            .single();
        if (error) throw error;

        return data
    });
    const [session] = createResource(getSession);
    const isOwner = createMemo(() => {
        return teamData()?.owner == session()?.session?.user.id;
    })
    const [teamName, setTeamName] = createSignal("");
    const [isToggled, setIsToggled] = createSignal(false);
    const updateTeamName = async () => {
        if (teamName() == "") {
            toast.error("The team name cannot be null!")
            return
        }
        if (!isOwner()) {
            toast.error("You must be the team owner to do this!")
            return
        }
        let id = toast.loading("Updating team...");
        updateTeam(teamId, {name: teamName()})
            .then(() => {
                toast.success("Successfully updated the team! Log back in to see changes.")
            })
            .catch((err) => {
                toast.error(err.message)
            })
            .finally(() => {
                toast.remove(id)
            })
    }
    return <div class={"flex flex-col gap-2 p-4 w-full dark:text-white"}>
        <Suspense fallback={<Loader2 class={"animate-spin m-auto"} size={40}/>}>
        <div class={"flex gap-2 flex-row w-full items-center"}>
            <span class={"h-0.5 rounded-full w-full bg-gray-200 dark:bg-gray-700"}/>
            <span class={"text-gray-700 dark:text-gray-300"}>General</span>
            <span class={"h-0.5 rounded-full w-full bg-gray-200 dark:bg-gray-700"}/>
        </div>
        <div class={"flex flex-row text-left max-h-fit items-center gap-2"}>
            <input class={`w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 ${!isOwner() && "cursor-not-allowed"}`}
                   placeholder={teamData()?.name}
                   value={teamName()}
                   disabled={!isOwner()}
                   onInput={(e) => {
                       setTeamName(e.target.value)
                   }}
            />
            <Show when={isOwner()}>
                <button class={"p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"} onClick={updateTeamName}><Check /></button>
            </Show>
        </div>
        <div class={"flex flex-row max-h-fit gap-2 items-center"}>
            <Toggle state={isToggled()} setState={setIsToggled} style={DefaultToggleStyle} disabled={!isOwner()} />
            <span class={"text-lg font-medium"}>Allow anyone to invite other users</span>
        </div>
        </Suspense>
    </div>
}
