
import {createResource, Suspense} from "solid-js";
import {useParams} from "@solidjs/router";
import {BookUser, GanttChart, Loader2, Users} from "lucide-solid";
import {getTeam} from "../lib/Teams.tsx";
import {createModal} from "../component/Modal.tsx";

export default function Dashboard() {
    let teamId = useParams().teamId;
    const [team] = createResource(async () => await getTeam(teamId));
    const {modal, open, close} = createModal<
        { test: string }
    >(
        (data, controller) => (
            <div class={"h-2/3 w-2/3 m-auto bg-white"}>
                {data.test}
                <button onClick={() => controller.close()}>Close</button>
            </div>
        ),
        {test: "initial"}
    );
    return <div class={"w-full h-full p-4 grid gap-4 grid-cols-2 auto-rows-fr dark:bg-gray-800"}>
        <div class={"card-default col-span-2 p-3 flex flex-col text-black dark:text-white"}>
            <h2 class={"text-4xl font-semibold"}>Team Overview</h2>
            <div class={"flex-auto flex flex-row pb-4"}>
                <Suspense fallback={<Loader2 class={"animate-spin m-auto"} />}>
                    <div class={"flex-auto text-center items-center justify-center my-auto"}>
                        <BookUser class={"mx-auto pb-2"} size={70} strokeWidth={1.5} />
                        <h4 class={"text-2xl"}>{team()?.partners.length} partner(s)</h4>
                    </div>
                    <div class={"flex-auto text-center items-center justify-center my-auto"}>
                        <Users class={"mx-auto pb-2"} size={70} strokeWidth={1.5} />
                        <h4 class={"text-2xl"}>{team()?.user_teams.length} users(s)</h4>
                    </div>
                    <div class={"flex-auto text-center items-center justify-center my-auto"}>
                        <GanttChart class={"mx-auto pb-2"} size={70} strokeWidth={1.5} />
                        <h4 class={"text-2xl"}>{team()?.roles.length} roles(s)</h4>
                    </div>
                </Suspense>
            </div>
        </div>

        <div class={"card-default p-3 text-black dark:text-white"}>
            <h2 class={"text-3xl font-semibold"}>New Partners</h2>
            <button class={"p-2 bg-white rounded-lg"} onClick={() => {
                open({ test: "123" });
            }}>Hello</button>
            <button class={"p-2 bg-white rounded-lg"} onClick={() => {
                open({ test: "abc" });
            }}>Hello</button>
        </div>
        <div class={"card-default text-black dark:text-white"}>

        </div>
        {modal()}
    </div>
}
