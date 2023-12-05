import {createModal, Modal} from "./Modal.tsx";
import {CheckIcon, ChevronsUpDown, Plus, X} from "lucide-solid";
import {createResource, createSignal, For} from "solid-js";
import {createPartner, createPartnerTags} from "../lib/Partners.tsx";
import {toast} from "solid-toast";

import {getTeamTags} from "../lib/Tags.tsx";
import {Database} from "../../database.types.ts";
import { Combobox } from "@kobalte/core";
import {createStore} from "solid-js/store";

export type CreatePartnerModalData = {
    teamId: string,
}
export default function createPartnerModal(teamId: string): Modal<CreatePartnerModalData> {
    return createModal<CreatePartnerModalData>(
        (data, controller) => {
            const [currentPartner, setCurrentPartner] =
                createStore<Database['public']['Tables']['partners']['Insert'] & {tags: string[]}>(
                    {name: "", team_id: "", tags: []}
                );
            const [allTags] = createResource<Database["public"]["Tables"]["tags"]["Row"][]>(async () => await getTeamTags(data.teamId) ?? [] );
            const [newContact, setNewContact] = createSignal("");

            const create = async () => {
                let toastId = toast.loading("Creating partner...");
                createPartner({
                    name: currentPartner.name,
                    type: currentPartner.type,
                    team_id: data.teamId,
                    contacts: currentPartner.contacts
                }).then((partner) => {
                    if (partner == null) {
                        toast.error("An error occurred while creating the partner!")
                        return
                    }
                    toast.success("Successfully created partner!");

                    createPartnerTags(
                        allTags()
                            ?.filter(tag => currentPartner.tags.includes(tag.name))
                            ?.map(tag => ({
                                    tag_id: tag.id,
                                    partner_id: partner.id
                                })
                            ) ?? []
                    )
                    controller.close();
                }).then(() => {
                }).catch((err) => {
                    toast.error(err.message)
                }).finally(() => {
                    toast.remove(toastId)
                })
                controller.close();
            }
            return (
                <div onClick={(event) => {
                    event.stopPropagation()
                }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg w-fit cursor-default m-auto dark:text-white p-2"}>
                    <div class={"flex flex-row gap-2"}>
                        <div class={"flex flex-col gap-2"}>
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"}
                                   value={currentPartner.name}
                                   onInput={(e) => {
                                       setCurrentPartner({...currentPartner, name: e.target.value})
                                   }
                                   } placeholder={"Name"}/>
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"}
                                   value={currentPartner.type ?? ""}
                                   onInput={(e) => {
                                       setCurrentPartner({...currentPartner, type: e.target.value})
                                   }}
                                   placeholder={"Type"}/>
                            <div class={"flex overflow-auto flex-row gap-2 bg-white dark:bg-gray-600 rounded-lg p-2"}>
                                <Combobox.Root
                                    multiple
                                    options={allTags()?.map((tag) => tag.name) ?? []}
                                    value={currentPartner.tags}
                                    onChange={(tags) => {
                                        setCurrentPartner({...currentPartner, tags: tags as any as string[]})
                                    }}
                                    placeholder="Tags..."
                                    itemComponent={props => (
                                        <Combobox.Item item={props.item}
                                                       class={"flex flex-row p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"}>
                                            <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
                                            <Combobox.ItemIndicator class={"ml-auto"}>
                                                <CheckIcon/>
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
                                                    <span
                                                        class="flex items-center bg-gray-200 dark:bg-gray-700 text-sm font-semibold px-2.5 py-0.5 w-fit rounded-full">
                                                        {option}
                                                        <button onClick={() => state.remove(option)}
                                                                class="ml-1.5 text-red-500 hover:text-red-700 focus:outline-none">
                                                            <X/>
                                                        </button>
                                                    </span>
                                                            </>}
                                                        </For>
                                                    </div>
                                                    <Combobox.Input
                                                        class="outline-none border-0 appearance-none bg-transparent"/>
                                                </div>
                                                <button onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
                                                    <X/>
                                                </button>
                                                <Combobox.Trigger>
                                                    <Combobox.Icon>
                                                        <ChevronsUpDown/>
                                                    </Combobox.Icon>
                                                </Combobox.Trigger>
                                            </>
                                        )}
                                    </Combobox.Control>
                                    <Combobox.Portal>
                                        <Combobox.Content
                                            class={"p-2 bg-gray-100 dark:bg-gray-600 rounded-lg dark:text-white"}>
                                            <Combobox.Listbox/>
                                        </Combobox.Content>
                                    </Combobox.Portal>
                                </Combobox.Root>
                            </div>
                            <div class={"flex flex-row gap-2 w-full"}>
                                <button
                                    class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2 flex-auto"}
                                    onClick={create}>Create
                                </button>
                            </div>
                        </div>
                        <div class={"bg-white dark:bg-gray-600 rounded-lg p-2 gap-2 h-44 overflow-auto flex flex-col"}>
                            <For each={currentPartner.contacts}>
                                {(contact, index) =>
                                    <div class={"flex flex-row gap-2"}>
                                        <input class={"appearance-none bg-white dark:bg-gray-700 rounded-lg p-1"}
                                               value={contact}
                                               onInput={(e) => {
                                                   let newContacts = currentPartner.contacts ?? [];
                                                   newContacts[index()] = e.target.value;
                                                   setCurrentPartner("contacts", newContacts);
                                               }}
                                        />
                                        <button
                                            class={"bg-white dark:bg-gray-700 rounded-lg text-red-500 p-1 flex-auto"}
                                            onClick={() => {
                                                let contacts = currentPartner.contacts ?? [];
                                                contacts.splice(index(), 1);
                                                setCurrentPartner("contacts", contacts);
                                            }}><X/></button>
                                    </div>
                                }
                            </For>
                            <div class={"flex flex-row gap-2"}>
                                <input type={"text"}
                                       class={"appearance-none bg-white dark:bg-gray-700 rounded-lg p-1 outline-none"}
                                       placeholder={"New contact"} value={newContact()}
                                       onInput={(e) => {
                                           setNewContact(e.target.value)
                                       }}/>
                                <button class={"bg-white dark:bg-gray-700 rounded-lg text-green-500 p-1 flex-auto"}
                                        onClick={() => {
                                            setCurrentPartner("contacts", currentPartner.contacts?.concat([newContact()]));
                                            setNewContact("");
                                        }}><Plus/></button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {teamId: teamId}
    );
}