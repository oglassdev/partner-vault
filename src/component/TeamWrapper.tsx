import {createMemo, createResource, For} from "solid-js";
import {A, Outlet, useLocation, useNavigate, useParams} from "@solidjs/router";
import {Bookmark, BookUser, GanttChart, LayoutDashboard, LogOut, Settings, Users} from "lucide-solid";
import {getSupabaseClient} from "../index.tsx";
import {getTeam} from "../lib/Teams.tsx";

export default function TeamWrapper() {
    let teamId = useParams().teamId;
    let navigate = useNavigate();
    let location = useLocation();
    let path = createMemo(() => location.pathname);
    let [session] = createResource(async () => await getSupabaseClient().auth.getSession());
    let [teamData] = createResource(async () => await getTeam(teamId));
    let navs = [
        { name: "Dashboard", href: `/teams/${teamId}/`, icon: <LayoutDashboard size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Partners", href: `/teams/${teamId}/partners`, icon: <BookUser size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Tags", href: `/teams/${teamId}/tags`, icon: <Bookmark size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Users", href: `/teams/${teamId}/users`, icon: <Users size={18} class={"my-auto"} strokeWidth={2} /> },
        { name: "Settings", href: `/teams/${teamId}/settings`, icon: <Settings size={18} class={"my-auto"} strokeWidth={2} /> }
    ]
    return <div class={"w-full h-full flex flex-row"}>
        <nav class={"w-64 h-full flex-none bg-gray-100 flex flex-col dark:bg-gray-900 dark:text-gray-100"}>
            <div class={"flex flex-col flex-auto gap-1 pt-14 px-4 font-medium overflow-auto"}>
                <For each={navs}>{(nav) =>
                    <A draggable={false} href={nav.href}>
                        <div class={`sidebar-button ${path() == nav.href && "bg-gray-300 dark:bg-gray-800"}`}>
                            {nav.icon}
                            <h4 class={"text-md"}>{nav.name}</h4>
                        </div>
                    </A>
                }</For>
            </div>
            <div class="flex w-full mt-auto items-center gap-1 p-4">
                <div class="flex-grow pr-0 text-sm overflow-hidden">
                    <h4 class="truncate font-medium">{session()?.data.session?.user.email}</h4>
                    <h4 class="truncate text-gray-600 dark:text-gray-400">{teamData()?.name || "Loading..."}</h4>
                </div>

                <button class={"flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-600"} onClick={() => navigate("/teams")}>
                    <LogOut class={"mx-auto"} size={22}/>
                </button>
            </div>
        </nav>
        <Outlet />
    </div>
}