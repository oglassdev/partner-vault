import {HelpCircle, LogOut, LucideDoorOpen} from "lucide-solid";
import {getSupabaseClient} from "../index.tsx";
import {toast} from "solid-toast";
import {createResource, Show} from "solid-js";
import {useNavigate} from "@solidjs/router";
import { exit } from "@tauri-apps/plugin-process";
import createHelpModal from "./HelpModal.tsx";

export default function Footer(props: { showUsername?: boolean, showLeave: boolean }) {
    let [username] = createResource(async () => {
        let {data, error} = await getSupabaseClient().auth.getSession();
        if (error != null) {
            toast.error(error.message);
            return undefined;
        }
        if (data?.session == null) {
            return undefined;
        }
        return data.session?.user.email
    });

    let navigate = useNavigate();

    let {modal: helpModal, open: openHelpModal} = createHelpModal(
        <>
            If you don't have an account, create one in the sign up page. <br />
            After logging in, select a team that you are in. <br />
            If you aren't in a team, you can create one or ask someone for an invite.
        </>
    )
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
            <button onClick={openHelpModal}><HelpCircle /></button>
            <button onClick={() => { exit(0) }}><LucideDoorOpen /></button>
            {helpModal()}
        </div>
    </footer>
}