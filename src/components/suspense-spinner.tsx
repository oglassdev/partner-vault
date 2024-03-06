import { Loader } from "lucide-solid";
import { ParentProps, Suspense, children, untrack } from "solid-js";
import { Transition } from "solid-transition-group";

export function SuspenseSpinner(props: ParentProps) {
  return (
    <Transition
      onEnter={(el, done) => {
        el.animate(
          [
            {
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
          {
            duration: 100,
            easing: "ease-in",
          },
        ).finished.then(done);
      }}
      onExit={(el, done) => {
        el.animate(
          [
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
          ],
          {
            duration: 100,
            easing: "ease-out",
          },
        ).finished.then(done);
      }}
      mode="outin"
    >
      <Suspense
        fallback={
          <div class="flex h-full w-full flex-auto bg-gray-500 bg-opacity-10 transition-all">
            <Loader
              class="text-muted-foreground m-auto animate-spin"
              size={24}
            />
          </div>
        }
      >
        {untrack(children(() => props.children))}
      </Suspense>
    </Transition>
  );
}
