import {Setter} from "solid-js";

export interface ToggleProps {
    state: boolean,
    setState: Setter<boolean>,
    disabled?: boolean,
    style: ToggleStyle
}
export interface ToggleStyle {
    background: {
        all: string,
        true?: string,
        false?: string,
        disabled?: string
    },
    slider: {
        all: string,
        true?: string,
        false?: string,
        disabled?: string
    }
}
export const DefaultToggleStyle: ToggleStyle = {
    background: {
        all: "w-14 h-8 bg-gray-200 rounded-full shadow-inner transition",
        true: "bg-green-500",
        false: "bg-red-500",
        disabled: "cursor-not-allowed"
    },
    slider: {
        all: "transform transition ease-in-out duration-200 absolute left-1 bottom-1 w-6 h-6 bg-white rounded-full shadow",
        true: "translate-x-6",
        disabled: "cursor-not-allowed"
    }
}
export default function Toggle(props: ToggleProps) {
    return <div class="flex items-center justify-center">
        <label class="inline-flex relative items-center cursor-pointer">
            <input disabled={props.disabled ?? false} type="checkbox" class="sr-only" checked={props.state} onChange={() => props.setState(!props.state)} />
            <div class={`${props.style.background.all} ${props.state ? props.style.background.true : props.style.background.false} ${props.disabled && props.style.background.disabled}`}></div>
            <div class={`${props.style.slider.all} ${props.state ? props.style.slider.true : props.style.slider.false} ${props.disabled && props.style.slider.disabled}`}></div>
        </label>
    </div>
}
