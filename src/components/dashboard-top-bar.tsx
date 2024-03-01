import { ParentProps, children } from "solid-js";
export default function DashboardTopBar(props: ParentProps) {
  const ch = children(() => props.children);
  return (
    <div
      class="border-muted sticky top-0 z-50 flex w-full flex-row
      items-center gap-2 border-b bg-white p-2 dark:bg-black"
    >
      <span class="mr-auto flex-none px-2 font-semibold">Partner Vault</span>
      {ch()}
    </div>
  );
}
