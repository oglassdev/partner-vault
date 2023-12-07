import {Accessor, createMemo, createSignal, JSX, Show} from "solid-js";
import {Portal} from "solid-js/web";
import {Transition} from "solid-transition-group";

/**
 * Controls for the modal
 */
export type ModalController<T> = {
    open: (data: T) => void,
    close: () => void
}
/**
 * Modal object that encapsulates the controller along with the modal function.
 */
export type Modal<T> = ModalController<T> & {
    modal: Accessor<JSX.Element>
}

/**
 * Create a modal object that allows for easy passing of data to and from said modal.
 *
 * @param children Function that returns the modal children.
 * @param initialData Data for an unsafe open of the modal.
 * @param onOpen Function that gets called when the modal is opened.
 * @param onClose Function that gets called when the modal is closed.
 *
 * @returns Modal<T> object that contains the modal and controller functions.
 */
export function createModal<T>(children: (data: T, controller: ModalController<T>) => JSX.Element, initialData: T, onOpen?: (data: T) => void, onClose?: (data: T) => void): Modal<T> {
    const [state, setState] = createSignal(false);
    const [data, setData] = createSignal(initialData);
    const controller: ModalController<T> = {
        open: (data) => {
            setState(true);
            setData(data as any);
            if (onOpen) onOpen(data);
        },
        close: () => {
            setState(false);
            if (onClose) onClose(data());
            setData(initialData as any);
        }
    };
    return {
        ...controller,
        modal: createMemo(() => (
            <Portal mount={document.body}>
                <Transition
                    onEnter={(el, done) => {
                        el.animate([
                                {opacity: 0, transform: "translateY(15px)"},
                                {opacity: 1, transform: "translateY(0px)"}
                            ],
                            {
                                duration: 100,
                                easing: 'ease-in'
                            }).finished.then(done)
                    }}
                    onExit={(el, done) => {
                        el.animate([
                                {opacity: 1, transform: "translateY(0px)"},
                                {opacity: 0, transform: "translateY(15px)"}
                            ],
                            {
                                duration: 100,
                                easing: 'ease-out'
                            }).finished.then(done)
                    }}
                >
                    <Show when={state()}>
                        <div class={"w-screen h-screen bg-black bg-opacity-30 fixed left-0 top-0 flex"} onClick={() => {
                            controller.close()
                        }}>
                            {children(data(), controller)}
                        </div>
                    </Show>
                </Transition>
            </Portal>
        )
        )
    }
}