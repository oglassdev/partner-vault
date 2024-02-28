import { useRouteData } from "@solidjs/router";
import { Suspense, createResource } from "solid-js";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import { TeamDataType } from "~/lib/team-data";

export default function Users() {
  const [example] = createResource(async () => {
    await new Promise((res) => setTimeout(res, 300));
    return "hello";
  });
  return (
    <SuspenseSpinner>
      <main class="p-4">{example()}</main>
    </SuspenseSpinner>
  );
}
