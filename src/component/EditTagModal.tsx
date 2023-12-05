import Modal, {ModalProps} from "./Modal.tsx";
import {createEffect, createSignal} from "solid-js";
import {toast} from "solid-toast";

import {deleteTag, updateTag} from "../lib/Tags.tsx";
import {Database} from "../../database.types.ts";
import {HexColorPicker} from "solid-colorful";

export interface EditTagModalProps extends ModalProps {
    teamId: string,
    tag: Database["public"]["Tables"]["tags"]["Row"] | undefined
}
export default function EditTagModal(props: EditTagModalProps) {
    const [name, setName] = createSignal(props.tag?.name);
    const [color, setColor] = createSignal("#" + props.tag?.color?.toString(16) ?? "000000")
    createEffect(() => {
        setName(props.tag?.name ?? "");
        setColor("#" + props.tag?.color?.toString(16) ?? "000000");
    });
    const removeTag = async () => {
        let toastId = toast.loading("Deleting tag with id " + props.tag?.id);
        deleteTag(props.tag?.id!).then(() => {
            toast.success("Successfully removed tag!")
            props.onClose();
        }).catch((err) => {
            toast.error(err.message)
        }).finally(() => {
            toast.remove(toastId)
        })
    }
    const update = async () => {
        let toastId = toast.loading("Updating tag with id " + props.tag?.id);
        updateTag({
            id: props.tag?.id,
            name: name() == props.tag?.name ? undefined : name(),
            color: parseInt(color().substring(1),16)
        }).then(() => {
            toast.success("Successfully updated tag!")
            props.onClose();
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
            <div class={"flex flex-row gap-2"}>
                <div class={"flex flex-col gap-2"}>
                    <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={name()}
                           onInput={(e) => {
                               setName(e.target.value)
                           }
                           } placeholder={"Name"} />
                    <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={color()}
                           onInput={(e) => {
                               setColor(e.target.value)
                           }
                           } placeholder={"Color"} />
                    <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-red-500 text-red-500 p-2 mt-auto"} onClick={removeTag}>Delete</button>
                    <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2"} onClick={update}>Update</button>
                </div>
                <div>
                    <HexColorPicker color={color()} onChange={setColor} />
                </div>
            </div>
        </div>
    </Modal>
}