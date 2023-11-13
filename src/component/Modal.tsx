import {Portal} from "solid-js/web";
import { ParentProps} from "solid-js";

export default function Modal(props: ParentProps) {
    return <Portal mount={document.body}>
        <div class={"w-screen h-screen bg-black fixed left-0 top-0 bg-opacity-40 items-center justify-center flex"}>
            {props.children}
        </div>
    </Portal>
}