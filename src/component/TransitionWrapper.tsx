import {Transition} from "solid-transition-group";
import {Outlet} from "@solidjs/router";

export default function TransitionWrapper() {
    return <Transition
        onEnter={(el, done) => {
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 200
            });
            a.finished.then(done);
        }}
        onExit={(el, done) => {
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200
            });
            a.finished.then(done);
        }}
        mode={"outin"}
    >
        <Outlet />
    </Transition>
}