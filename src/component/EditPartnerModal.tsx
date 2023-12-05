import Modal, {ModalProps} from "./Modal.tsx";
import {Database} from "../../database.types.ts";
import {CheckIcon, ChevronsUpDown, Plus, X} from "lucide-solid";
import {createEffect, createResource, createSignal, For, Show} from "solid-js";
import {createPartnerTags, deletePartnerTags, removePartner, updatePartner} from "../lib/Partners.tsx";
import {toast} from "solid-toast";
import {Combobox} from "@kobalte/core";
import {getTeamTags} from "../lib/Tags.tsx";
import {createStore} from "solid-js/store";

export interface EditPartnerModalProps extends ModalProps {
    teamId: string,
    partner: Database["public"]["Tables"]["partners"]["Row"] | undefined,
    tags: Database["public"]["Tables"]["tags"]["Row"][] | undefined
}
export default function EditPartnerModal(props: EditPartnerModalProps) {
    const [currentPartner, setCurrentPartner] =
        createStore<Database['public']['Tables']['partners']['Update']>(
            {
                name: props.partner?.name,
                type: props.partner?.type,
                contacts: props.partner?.contacts ?? [],
            }
        );
    const [tags, setTags] =
        createStore<Database['public']['Tables']['tags']['Row'][]>([]);
    const [allTags] = createResource<Database["public"]["Tables"]["tags"]["Row"][]>(async () => await getTeamTags(props.teamId) ?? [] );

    const [newContact, setNewContact] = createSignal("");
    createEffect(() => {
        setCurrentPartner(props.partner ?? currentPartner);
        setTags(props.tags ?? []);
    });
    const deletePartner = async () => {
        let toastId = toast.loading("Deleting partner with id " + props.partner?.id);
        removePartner(props.partner?.id!).then(() => {
            toast.success("Successfully removed partner!")
            props.onClose();
        }).catch((err) => {
            toast.error(err.message)
        }).finally(() => {
            toast.remove(toastId)
        })
    }
    const update = async () => {
        console.log(props.partner);
        let toastId = toast.loading("Updating partner with id " + props.partner?.id);
        updatePartner(currentPartner).then(() => {
            toast.success("Successfully updated partner!")
            deletePartnerTags(currentPartner.id!).then(() => {
                createPartnerTags(tags.map(tag => ({partner_id: currentPartner.id ?? "", tag_id: tag.id}))).finally(() => props.onClose())
            })

        }).catch((err) => {
            toast.error(err.message)
        }).finally(() => {
            toast.remove(toastId)
        })
    }
    return <Modal {...props}>
        <div onClick={(event) => {
            event.stopPropagation()
        }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg w-fit cursor-default m-auto dark:text-white p-2"}>
            <Show
                when={props.partner != undefined && props.tags != undefined}
                fallback={<span>
                    A strange error occurred while rendering the edit modal!
                </span>}
            >
                <div class={"flex flex-row gap-2"}>
                    <div class={"flex flex-col gap-2"}>
                        <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={currentPartner.name}
                               onInput={(e) => {
                                   setCurrentPartner("name", e.target.value)
                               }
                        } placeholder={"Name"} />
                        <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={currentPartner.type ?? ""}
                               onInput={(e) => {
                                   setCurrentPartner("type", e.target.value)
                               }}
                               placeholder={"Type"} />
                        <div class={"flex overflow-auto flex-row gap-2 bg-white dark:bg-gray-600 rounded-lg p-2"}>
                            <Combobox.Root
                                multiple
                                options={allTags()?.map((tag) => tag.name) ?? []}
                                value={tags.map(tag => (tag.name))}
                                onChange={(values) => {
                                    let tags = (values as any as string[])
                                        .map((tagName) => allTags()?.find((tag) => tag.name == tagName))
                                        .filter((tag) => tag != undefined)
                                        .map((tag) => tag!)
                                    setTags(tags);
                                }}
                                placeholder="Tags..."
                                itemComponent={props => (
                                    <Combobox.Item item={props.item} class={"flex flex-row p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"}>
                                        <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
                                        <Combobox.ItemIndicator class={"ml-auto"}>
                                            <CheckIcon />
                                        </Combobox.ItemIndicator>
                                    </Combobox.Item>
                                )}
                            >
                                <Combobox.Control<string> aria-label="Tags" class={"flex-row flex"}>
                                    {state => (
                                        <>
                                            <div>
                                                <div class={"overflow-auto flex-none gap-1 flex flex-col"}>
                                                    <For each={state.selectedOptions()}>
                                                        {option => <>
                                                    <span class="flex items-center bg-gray-200 dark:bg-gray-700 text-sm font-semibold px-2.5 py-0.5 w-fit rounded-full">
                                                        {option}
                                                        <button onClick={() => state.remove(option)} class="ml-1.5 text-red-500 hover:text-red-700 focus:outline-none">
                                                            <X />
                                                        </button>
                                                    </span>
                                                        </>}
                                                    </For>
                                                </div>
                                                <Combobox.Input class="outline-none border-0 appearance-none bg-transparent" />
                                            </div>
                                            <button onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
                                                <X />
                                            </button>
                                            <Combobox.Trigger>
                                                <Combobox.Icon>
                                                    <ChevronsUpDown />
                                                </Combobox.Icon>
                                            </Combobox.Trigger>
                                        </>
                                    )}
                                </Combobox.Control>
                                <Combobox.Portal>
                                    <Combobox.Content class={"p-2 bg-gray-100 dark:bg-gray-600 rounded-lg dark:text-white"}>
                                        <Combobox.Listbox />
                                    </Combobox.Content>
                                </Combobox.Portal>
                            </Combobox.Root>
                        </div>
                        <div class={"flex flex-row gap-2 w-full"}>
                            <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2 flex-auto"} onClick={update}>Update</button>
                            <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-red-500 text-red-500 p-2 flex-auto"} onClick={deletePartner}>Delete</button>
                        </div>
                    </div>
                    <div class={"bg-white dark:bg-gray-600 rounded-lg p-2 gap-2 h-44 overflow-auto flex flex-col"}>
                        <For each={currentPartner.contacts}>
                            {(contact, index) =>
                                <div class={"flex flex-row gap-2"}>
                                    <input class={"appearance-none bg-white dark:bg-gray-700 rounded-lg p-1"} value={contact}
                                           onInput={(e) => {
                                               let cntcts = currentPartner.contacts ?? [];
                                               setCurrentPartner("contacts",[
                                                   ...cntcts.slice(0, index()),
                                                   e.target.value,
                                                   ...cntcts.slice(index() + 1)
                                               ]);
                                           }}
                                    />
                                    <button class={"bg-white dark:bg-gray-700 rounded-lg border-2 border-red-500 text-red-500 p-1 flex-auto"}
                                    onClick={() => {
                                        let contacts = currentPartner.contacts ?? [];
                                        setCurrentPartner("contacts", contacts.slice(0, index()).concat(contacts.slice(index() + 1)))
                                    }}><X /></button>
                                </div>
                            }
                        </For>
                        <div class={"flex flex-row gap-2"}>
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-700 rounded-lg p-1"} placeholder={"New contact"} value={newContact()}
                                   onInput={(e) => {
                                       setNewContact(e.target.value)
                                   }}/>
                            <button class={"bg-white dark:bg-gray-700 rounded-lg border-2 border-green-500 text-green-500 p-1 flex-auto"}
                                    onClick={() => {
                                        if (newContact() == "") {
                                            toast.error("You cannot have an empty contact!", {
                                                id: "empty_contact"
                                            })
                                            return
                                        }
                                        setCurrentPartner("contacts", currentPartner.contacts?.concat([newContact()]) ?? []);
                                        setNewContact("");
                                    }}><Plus /></button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    </Modal>
}