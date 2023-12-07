import {createModal} from "../lib/Modal.tsx";
import {X} from "lucide-solid";
import {JSX} from "solid-js";

export default function createHelpModal(info: JSX.Element) {
    return createModal<{}>(
        (_, controller) => (
            <div onClick={(event) => {
                event.stopPropagation()
            }} class={"bg-gray-200 dark:bg-gray-700 rounded-lg h-fit flex flex-col cursor-default m-auto dark:text-white p-2 gap-2"}>
                <div class={"flex-row flex justify-center items-center w-full"}>
                    <span class={"text-2xl font-medium"}>Help</span>
                    <button class={"ml-auto"} onClick={controller.close}><X /></button>
                </div>
                <p class={""}>{info}</p>
            </div>
        ),
        {}
        )
}