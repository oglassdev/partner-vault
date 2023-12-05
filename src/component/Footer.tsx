import {DoorClosed, DoorOpen, LogOut, LucideDoorOpen, Settings} from "lucide-solid";
import {getSupabaseClient} from "../index.tsx";
import {toast} from "solid-toast";
import {createResource, Show} from "solid-js";
import {useNavigate} from "@solidjs/router";
import { exit } from "@tauri-apps/plugin-process";

let fetchUsername = async () => {
    let {data, error} = await getSupabaseClient().auth.getSession();
    if (error != null) {
        toast.error(error.message);
        return undefined;
    }
    if (data?.session == null) {
        return undefined;
    }
    return data.session?.user.email
}
export default function Footer(props: { showUsername?: boolean, showLeave: boolean }) {
    let [username] = createResource(fetchUsername)
    let navigate = useNavigate()
    return <footer class={"fixed bottom-0 w-full flex flex-row p-4"}>
        <div>
            <Show when={props.showUsername}>
                <div class={"text-black dark:text-white"}>{username()}</div>
            </Show>
            <div class={"text-gray-500 dark:text-gray-400"}>Partner Vault v0.0.1</div>
        </div>
        <span class={"flex-auto"} />
        <div class={"items-end flex space-x-4 dark:text-white"}>
            {props.showLeave && <button onClick={() => {
                getSupabaseClient().auth.signOut().then(() => {
                    navigate("/");
                    toast.success("Logged out!")
                })
            }}><LogOut/></button>}
            <button onClick={() => { exit(0) }}><LucideDoorOpen /></button>
        </div>
    </footer>
}