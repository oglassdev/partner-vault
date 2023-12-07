import {Database} from "../../database.types.ts";
import {createModal, Modal} from "../lib/Modal.tsx";
import {createStore} from "solid-js/store";
import {HexColorPicker} from "solid-colorful";
import {createTag, deleteTag, updateTag} from "../lib/Tags.tsx";
import {toast} from "solid-toast";
import {hexToNumber, numberToHex} from "../lib/Color.tsx";

export type CreateTagModalData = {
    teamId: string
}
export function createTagModal(teamId: string, refetch: () => void): Modal<CreateTagModalData> {
    return createModal(
        (data, controller) => {
            const [tag, setTag] = createStore<Database['public']['Tables']['tags']['Insert']>({
                name: "",
                color: 0,
                team_id: data.teamId
            });
            const insert = async () => {
                let toastId = toast.loading("Updating tag with id " + tag.id);
                createTag(tag).then(() => {
                    toast.success("Successfully created tag!")
                    controller.close();
                    refetch();
                }).catch((err) => {
                    toast.error(err.message)
                }).finally(() => {
                    toast.remove(toastId)
                })
            }
            return (
                <div onClick={(event) => {
                    event.stopPropagation()
                }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg w-fit cursor-default m-auto dark:text-white p-2"}>
                    <div class={"flex flex-row gap-2"}>
                        <div class={"flex flex-col gap-2"}>
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={tag.name}
                                   onInput={(e) => {
                                       setTag("name",e.target.value)
                                   }
                                   } placeholder={"Name"} />
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={numberToHex(tag.color ?? 0)}
                                   onInput={(e) => {
                                       setTag("color",parseInt(e.target.value?.substring(1) ?? "0"))
                                   }
                                   } placeholder={"Color"} />
                            <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2 mt-auto"} onClick={insert}>Create</button>
                        </div>
                        <div>
                            <HexColorPicker color={numberToHex(tag.color ?? 0)} onChange={(color) => {
                                setTag("color",hexToNumber(color))
                            }} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            teamId: teamId
        }
    )
}
export type EditTagModalData = {
    teamId: string,
    tag: Database['public']['Tables']['tags']['Row']
}
export function editTagModal(teamId: string, refetch: () => void): Modal<EditTagModalData> {
    return createModal(
        (data, controller) => {
            const [tag, setTag] = createStore<Database['public']['Tables']['tags']['Update']>(data.tag);
            const removeTag = async () => {
                let toastId = toast.loading("Deleting tag with id " + tag.id);
                deleteTag(tag.id!).then(() => {
                    toast.success("Successfully removed tag!")
                    controller.close();
                    refetch();
                }).catch((err) => {
                    toast.error(err.message)
                }).finally(() => {
                    toast.remove(toastId)
                })
            }
            const update = async () => {
                let toastId = toast.loading("Updating tag with id " + tag.id);
                updateTag({
                    id: tag.id,
                    name: tag.name,
                    color: tag.color
                }).then(() => {
                    toast.success("Successfully updated tag!")
                    controller.close();
                    refetch();
                }).catch((err) => {
                    toast.error(err.message)
                }).finally(() => {
                    toast.remove(toastId)
                })
            }
            return (
                <div onClick={(event) => {
                    event.stopPropagation()
                }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg w-fit cursor-default m-auto dark:text-white p-2"}>
                    <div class={"flex flex-row gap-2"}>
                        <div class={"flex flex-col gap-2"}>
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={tag.name}
                                   onInput={(e) => {
                                       setTag("name",e.target.value)
                                   }
                                   } placeholder={"Name"} />
                            <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={numberToHex(tag.color ?? 0)}
                                   onInput={(e) => {
                                       setTag("color",hexToNumber(e.target.value))
                                   }
                                   } placeholder={"Color"} />
                            <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-red-500 text-red-500 p-2 mt-auto"} onClick={removeTag}>Delete</button>
                            <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2"} onClick={update}>Update</button>
                        </div>
                        <div>
                            <HexColorPicker color={'#' + tag.color?.toString(16)} onChange={(color) => {
                                setTag("color",hexToNumber(color))
                            }} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            teamId: teamId,
            tag: {
                id: "",
                name: "",
            }
        }
    )
}