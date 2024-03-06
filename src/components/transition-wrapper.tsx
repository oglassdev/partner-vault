import { Outlet } from "@solidjs/router";
import { Transition } from "solid-transition-group";

export default function TransitionWrapper() {
  return (
    <Transition
      onEnter={(el, done) => {
        el.animate(
          [
            {
              transform: "translate(4%, 0%)",
              opacity: 0,
            },
            {
              transform: "translate(0%, 0%)",
              opacity: 100,
            },
          ],
          {
            duration: 150,
            easing: "ease-out",
          },
        ).finished.then(done);
      }}
      onExit={(el, done) => {
        el.animate(
          [
            {
              transform: "translate(0%, 0%)",
              opacity: 100,
            },
            {
              transform: "translate(-4%, 0%)",
              opacity: 0,
            },
          ],
          {
            duration: 150,
            easing: "ease-in",
          },
        ).finished.then(done);
      }}
      mode="outin"
    >
      <Outlet />
    </Transition>
  );
}
