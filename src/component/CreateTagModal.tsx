import Modal, {ModalProps} from "./Modal.tsx";
import {toast} from "solid-toast";

import {createTag} from "../lib/Tags.tsx";
import {HexColorPicker} from "solid-colorful";
import {createStore} from "solid-js/store";
import {Database} from "../../database.types.ts";

export interface CreateTagModalProps extends ModalProps {
    teamId: string
}
export default function CreateTagModal(props: CreateTagModalProps) {
    const [tag, setTag] = createStore<Database["public"]["Tables"]["tags"]["Insert"]>({
        name: "",
        team_id: props.teamId
    });

    const create = async () => {
        let toastId = toast.loading("Creating partner...");
        createTag({
            color: tag.color,
            name: tag.name,
            team_id: props.teamId
        }).then(() => {
            toast.success("Successfully created tag!");
            props.onClose();
        }).catch(err => {
            toast.error(err.message);
        }).finally(() => {
            toast.dismiss(toastId);
        })
    }
    return <Modal {...props}>
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
                    <input type={"text"} class={"appearance-none bg-white dark:bg-gray-600 rounded-lg p-2"} value={"#" + tag.color ?? ""}
                           onInput={(e) => {
                               setTag("color",parseInt(e.target.value.substring(1),16))
                           }
                           } placeholder={"Color"} />
                    <button class={"bg-white dark:bg-gray-600 rounded-lg border-2 border-green-500 text-green-500 p-2 mt-auto"} onClick={create}>Create</button>
                </div>
                <div>
                    <HexColorPicker color={tag.color?.toString(16)} onChange={(color: string) => {
                        setTag("color",parseInt(color.value.substring(1),16));
                    }} />
                </div>
            </div>
        </div>
    </Modal>
}