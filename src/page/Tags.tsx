import {useParams} from "@solidjs/router";
import {createMemo, createResource, createSignal, For, Show, Suspense} from "solid-js";
import {Loader2, Plus, RefreshCcw} from "lucide-solid";
import {TransitionGroup} from "solid-transition-group";
import {numberToHex} from "../lib/Color.tsx";
import {getTeamTags} from "../lib/Tags.tsx";
import {formatDate} from "../lib/DateUtil.tsx";
import CreateTagModal from "../component/CreateTagModal.tsx";
import {Database} from "../../database.types.ts";
import EditPartnerModal from "../component/EditPartnerModal.tsx";
import EditTagModal from "../component/EditTagModal.tsx";

export default function Tags() {
    let teamId = useParams().teamId;
    const [dbTags, {refetch: refetchTags}] = createResource(async () => await getTeamTags(teamId))
    const [search, setSearch] = createSignal("");

    const tags = createMemo(() => {
        return dbTags()?.filter((role) => search() == null || role.name.toLowerCase().includes(search().toLowerCase()))
    })

    const [createModalOpen, setCreateModalOpen] = createSignal(false);
    const [editModalData, setEditModalData] = createSignal<Database["public"]["Tables"]["tags"]['Row']|undefined>();
    const [editModalOpen, setEditModalOpen] = createSignal(false);
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
                    refetchTags()
                }}
            >
                <RefreshCcw class={"m-auto"}/>
            </button>
            <button
                class={"flex-none p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"}
                onClick={() => {
                    setCreateModalOpen(true)
                }}
            >
                <Plus class={"m-auto"}/>
            </button>
        </div>
        <Suspense fallback={<Loader2 class={"animate-spin m-auto"} size={40}/>}>
            <div class={"h-fit gap-2 rounded-lg overflow-auto overscroll-auto flex flex-wrap"}>
                <Show when={dbTags()?.length == 0}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No tags found. <button>Create one?</button>
                    </div>
                </Show>
                <Show when={tags()?.length == 0 && dbTags()?.length != 0}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No tags found matching the criteria.
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
                    <For each={tags()}>
                        {(tag) => {
                            return <button
                                class={"w-60 max-h-fit text-left bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex flex-col hover:bg-gray-200 dark:hover:bg-gray-600 leading-5 border-2"}
                                style={{"border-color": numberToHex(tag.color ?? 0)}}
                                onClick={() => {
                                    setEditModalData(tag);
                                    setEditModalOpen(true);
                                }}
                            >
                                <h4 class={"font-medium text-3xl mb-auto"}>{tag.name}</h4>
                                <h4 class={"text-md text-gray-700 dark:text-gray-200"}>Created {formatDate(tag.created_at)}</h4>
                            </button>
                        }}
                    </For>
                </TransitionGroup>
            </div>
        </Suspense>
        <CreateTagModal teamId={teamId} isOpen={createModalOpen} onClose={() => {
            setCreateModalOpen(false);
            refetchTags()
        }} />
        <EditTagModal teamId={teamId} tag={editModalData()} isOpen={editModalOpen} onClose={() => {
            setEditModalOpen(false);
            refetchTags()
        }} />
    </div>
}