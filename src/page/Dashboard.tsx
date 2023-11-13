import {Loader2} from "lucide-solid";
import {createResource, Suspense} from "solid-js";
import {useParams, useRouteData} from "@solidjs/router";

export default function Dashboard() {
    let teamId = useParams().teamId;

    const [partnerCount, { mutate, refetch }] = createResource(fetchPartners);
    return <div class={"w-full h-full p-4 grid gap-4 grid-cols-3 dark:bg-gray-800"}>
        <div class={"flex-auto bg-gray-200 rounded-lg col-span-3"}>
            <Suspense fallback={<Loader2 class={"transition-transform animate-spin"} size={48} />}>
                <div>{partnerCount()}</div>
            </Suspense>
        </div>

        <div class={"flex-auto bg-gray-200 rounded-lg"}>

        </div>
        <div class={"flex-auto bg-gray-200 rounded-lg"}>asd</div>
        <div class={"flex-auto bg-gray-200 rounded-lg"}>asd</div>
    </div>
}