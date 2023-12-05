import {Transition} from "solid-transition-group";
import {Outlet} from "@solidjs/router";
import Footer from "./Footer.tsx";

export default function LoginWrapper() {
    return <div class={"flex w-full h-full"}>
        <Transition
        onEnter={(el, done) => {
            const a = el.animate([
                { opacity: 0, transform: "translateY(-15px)" },
                { opacity: 1, transform: "translateY(0px)" }],
                {
                duration: 200, easing: "ease-in"
            });
            a.finished.then(done);
        }}
        onExit={(el, done) => {
            const a = el.animate([
                    { opacity: 1, transform: "translateY(0px)" },
                    { opacity: 0, transform: "translateY(15px)" }],
                {
                    duration: 200,
                    easing: "ease-out"
                });
            a.finished.then(done);
        }}
        mode={"outin"}
    >
        <Outlet />
    </Transition>
        <Footer showLeave={false} />
    </div>
}