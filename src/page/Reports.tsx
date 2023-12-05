import {useParams} from "@solidjs/router";
import {createMemo, createResource, createSignal, For, Show, Suspense} from "solid-js";
import {save} from "@tauri-apps/plugin-dialog"
import {toast} from "solid-toast";

export default function Reports() {
    let teamId = useParams().teamId;
    const [search, setSearch] = createSignal("");

    return <div class={"p-4 flex gap-2 dark:text-white"}>
        <button class={"max-h-fit rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 p-2 bg-white"} onClick={
        () => {save().then(r => toast(r))}
    }>Create Report</button>
    </div>
}