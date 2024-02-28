import { createResource } from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import { SuspenseSpinner } from "~/components/suspense-spinner";

export default function Dashboard() {
  const [example] = createResource(async () => {
    await new Promise((res) => setTimeout(res, 300));
    return "hello";
  });
  return (
    <main class="h-full w-full">
      <DashboardTopBar />
      <SuspenseSpinner>
        <main class="p-4">{example()}</main>
      </SuspenseSpinner>
    </main>
  );
}
