
import {createResource} from "solid-js";
import {useParams} from "@solidjs/router";
import {getPartners} from "../lib/Database.tsx";

export default function Dashboard() {
    let teamId = useParams().teamId;
    const [partners] = createResource(async () => await getPartners(teamId));
    return <div class={"w-full h-full p-4 grid gap-4 grid-cols-3 dark:bg-gray-800"}>
        <div class={"flex-auto bg-gray-200 rounded-lg col-span-3"}>
            <div>{partners()?.data?.length}</div>
        </div>

        <div class={"flex-auto bg-gray-200 rounded-lg"}>

        </div>
        <div class={"flex-auto bg-gray-200 rounded-lg"}>asd</div>
        <div class={"flex-auto bg-gray-200 rounded-lg"}>asd</div>
    </div>
}