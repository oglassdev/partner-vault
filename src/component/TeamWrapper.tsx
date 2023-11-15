import {createSignal, For, Show} from "solid-js";
import {A, Outlet, useParams} from "@solidjs/router";
import {Bookmark, BookUser, GanttChart, LayoutDashboard, Settings, Users, XIcon} from "lucide-solid";
import Modal from "./Modal.tsx";

export default function TeamWrapper() {
    let team = useParams().teamId;
    let navs = [
        { name: "Dashboard", href: `/teams/${team}/`, icon: <LayoutDashboard size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Partners", href: `/teams/${team}/partners`, icon: <BookUser size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Roles", href: `/teams/${team}/roles`, icon: <GanttChart size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Tags", href: `/teams/${team}/tags`, icon: <Bookmark size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Users", href: `/teams/${team}/users`, icon: <Users size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Settings", href: `/teams/${team}/settings`, icon: <Settings size={18} class={"my-auto"} strokeWidth={2} /> }
    ]
    let [modalState,setModalState] = createSignal(false);
    return <div class={"w-full h-screen flex flex-col sm:flex-row"}>
        <nav class={"w-64 h-full flex-none bg-gray-100 flex flex-col dark:bg-gray-900 dark:text-gray-100"}>
            <div class={"flex flex-col flex-auto gap-1 pt-14 px-4 font-medium overflow-auto"}>
                <For each={navs}>{(nav) =>
                    <A href={nav.href}>
                        <div class={"sidebar-button"}>
                            {nav.icon}
                            <h4 class={"text-md"}>{nav.name}</h4>
                        </div>
                    </A>
                }</For>
            </div>
            <div class={"flex-none h-14 bg-gray-500 max-w-full flex flex-row overflow-clip"}>
                <div class={"flex-none w-52"}>
                    <h4 class={"flex-none truncate"}>Crestwood School District</h4>
                </div>
                <div class={"w-14 h-full bg-gray-200"}></div>
            </div>
            <Show when={modalState()}>
                <Modal>
                    <div class={"w-2/3 h-2/3 bg-white rounded-lg dark:bg-gray-900 shadow-md"}>
                        <button class="w-10 h-10 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => setModalState(false)}>
                            <XIcon class={"m-auto dark:stroke-white"} />
                        </button>
                    </div>
                </Modal>
            </Show>
        </nav>
        <Outlet />
    </div>
}