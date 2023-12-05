import {useParams} from "@solidjs/router";
import {createMemo, createResource, createSignal, For, Show, Suspense} from "solid-js";
import {Select} from "@kobalte/core";
import {CheckIcon, Loader2, Plus, RefreshCcw} from "lucide-solid";
import {getPartners} from "../lib/Partners.tsx";
import {getTeamTags} from "../lib/Tags.tsx";
import {TransitionGroup} from "solid-transition-group";
import {formatDate} from "../lib/DateUtil.tsx";
import {Database} from "../../database.types.ts";
import EditPartnerModal from "../component/EditPartnerModal.tsx";
import createPartnerModal from "../component/CreatePartnerModal.tsx";

export default function Partners() {
    let teamId = useParams().teamId;
    const [tags, {refetch: refetchTags}] = createResource(async () => await getTeamTags(teamId))
    const [dbPartners, {refetch: refetchPartners}] = createResource(async () => await getPartners(teamId));

    const [search, setSearch] = createSignal("");
    const [type, setType] = createSignal("");
    const [tagId, setTagId] = createSignal("");

    const partners = createMemo(() => {
        return dbPartners()
            ?.filter(partner => {
                return partner.name.toLowerCase().includes(search().toLowerCase()) &&
                    (partner.type?.toLowerCase()?.includes(type().toLowerCase()) ?? true)
            })
    })

    const [editModalData, setEditModalData] = createSignal<{ partner: Database['public']['Tables']['partners']['Row'], tags: Database['public']['Tables']['tags']['Row'][] }>();
    const [editModalShown, setEditModalShown] = createSignal<boolean>(false);

    const {modal: createModal, open: openCreateModal} = createPartnerModal(teamId);

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
                    refetchPartners()
                }}
            >
                <RefreshCcw class={"m-auto"}/>
            </button>
            <button
                class={"flex-none p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"}
                onClick={() => {
                    openCreateModal({teamId: teamId})
                }}
            >
                <Plus class={"m-auto"}/>
            </button>
        </div>
        <div class={"flex flex-row gap-2"}>
            <Select.Root
                options={tags()?.map((a) => a.id) ?? []}
                placeholder={"Tags"}
                value={tagId()}
                onChange={(input) => {
                    setTagId(input);
                }}
                itemComponent={props => (
                    <Select.Item item={props.item}
                                 class={"px-4 py-1 flex flex-row hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white items-center gap-2"}>
                        <Select.ItemLabel>{tags()?.filter((tag) => tag.id == props.item.rawValue as string)[0].name}</Select.ItemLabel>
                        <Select.ItemIndicator><CheckIcon size={18} class={"mx-auto"}/></Select.ItemIndicator>
                    </Select.Item>
                )}
            >
                <Select.Trigger class="bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-1 flex flex-row"
                                aria-label="Tags">
                    <Select.Value class="text-gray-700 dark:text-gray-300">
                        {state => {
                            return <div>{tags()?.filter((tag) => tag.id == state.selectedOption())[0].name}</div>
                        }}
                    </Select.Value>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content
                        class="bg-gray-200 dark:bg-gray-700 shadow-md rounded-lg overflow-auto dark:text-white max-h-32 overscroll-auto">
                        <Select.Listbox class="select__listbox"/>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
            <input
                class={"bg-gray-200 dark:bg-gray-700 rounded-full px-3 w-24 placeholder:text-center placeholder-gray-700 dark:placeholder-gray-300 outline-none"}
                placeholder={"Type"}
                onInput={(e) => {
                    setType(e.target.value);
                }}
            />

        </div>

        <Suspense fallback={<Loader2 class={"animate-spin m-auto"} size={40}/>}>
            <div class={"h-fit gap-2 rounded-lg overflow-auto overscroll-auto flex flex-wrap"}>
                <Show when={dbPartners()?.length == 0}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No partners found. <button>Create one?</button>
                    </div>
                </Show>
                <Show when={partners()?.length == 0 && dbPartners()?.length != 0}>
                    <div class={"m-auto items-center justify-center text-xl mt-4"}>
                        No partners found matching the criteria.
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
                    <For each={partners()}>
                        {(partner) => {
                            return <button
                                class={"w-60 max-h-fit text-left bg-gray-200 dark:bg-gray-700 rounded-lg p-2 flex flex-col hover:bg-gray-300 dark:hover:bg-gray-600 leading-5"}
                                onClick={() => {
                                    const {partner_tags, ...partnerWithoutTags} = partner;
                                    setEditModalData({partner: partnerWithoutTags, tags: partner.partner_tags
                                            .filter((tag) => tag.tags != null)
                                            .map(partnerTag => partnerTag.tags!)})
                                    setEditModalShown(true)
                                }}
                            >
                                <h4 class={"font-medium text-3xl"}>{partner.name}</h4>
                                <div class={"flex w-full flex-row flex-wrap gap-1 mb-auto mt-1"}>
                                    <For each={partner.partner_tags}>
                                        {(tag) => {
                                            return <div
                                                class={"rounded-full px-2 py-1 text-xs bg-blue-500"}>{tag.tags?.name}</div>
                                        }}
                                    </For>
                                </div>
                                {partner.type && <h4 class={"text-2xl font-medium"}>{partner.type}</h4>}
                                <h4 class={"text-md text-gray-700 dark:text-gray-200"}>{partner.contacts?.length ?? 0} contacts</h4>
                                <h4 class={"text-md text-gray-700 dark:text-gray-200"}>Created {formatDate(partner.created_at)}</h4>
                            </button>
                        }}
                    </For>
                </TransitionGroup>
            </div>
        </Suspense>
        <EditPartnerModal isOpen={editModalShown} onClose={() => {
            setEditModalShown(false);
            setEditModalData(undefined);
            refetchPartners();
        }} partner={editModalData()?.partner} tags={editModalData()?.tags} teamId={teamId} />
        {createModal()}
    </div>
}