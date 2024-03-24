import { A, useLocation, useNavigate, useParams } from "@solidjs/router";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  For,
  Suspense,
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { JSX } from "solid-js";
import { Select } from "~/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import LogoutButton from "./logout-button";
import ColorModeToggle from "./color-mode-toggle";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { Database } from "../../database.types";
import { Skeleton } from "./ui/skeleton";
import { getUser } from "~/lib/database/supabase-user";
import { platform } from "@tauri-apps/plugin-os";
import { handleError } from "~/lib/database/database";

export type LinkGroup = {
  name: string | undefined;
  links: Link[];
};
export type Link = {
  name: string;
  href: string;
  show: boolean;
  icon: JSX.Element;
};
export default function DashboardNav(props: { groups: LinkGroup[] }) {
  const location = useLocation();
  const supabase = useSupabaseContext();
  const { team_id } = useParams();
  const navigate = useNavigate();

  const [user] = createResource(getUser);

  const [isMac] = createResource(async () => (await platform()) == "macos", {
    initialValue: false,
  });

  type SelectOption = {
    value: string;
    name: string;
    disabled: boolean;
    onPress: () => void;
  };

  const selectOptions: SelectOption[] = [
    {
      value: "back",
      name: "Back",
      disabled: false,
      onPress: () => {
        navigate("/teams");
      },
    },
  ];
  const [option, setOption] = createSignal<SelectOption>();

  const [name] = createResource(async () => {
    return handleError(
      await supabase
        .from("teams")
        .select("name")
        .eq("id", team_id)
        .limit(1)
        .maybeSingle(),
    )?.name;
  });

  createEffect(() => {
    option()?.onPress();
  });

  return (
    <nav
      class="
      border-muted flex w-full flex-none flex-row
      gap-1 bg-opacity-15 p-2 transition-all sm:h-full sm:w-64 sm:flex-col sm:border-r
      "
    >
      <div class="flex flex-none flex-row gap-2">
        <Select<SelectOption>
          value={option()}
          onChange={setOption}
          options={selectOptions}
          optionValue={"value"}
          optionTextValue={"name"}
          optionDisabled={"disabled"}
          placeholder="Select a team…"
          class="flex-auto"
          itemComponent={(props) => {
            return (
              <SelectItem class="pl-2" item={props.item}>
                {props.item.rawValue.name}
              </SelectItem>
            );
          }}
        >
          <SelectTrigger
            aria-label="Team"
            class={`hidden h-9 flex-none items-center overflow-hidden text-ellipsis text-left sm:flex ${isMac() ? "mt-5" : "mt-0"}`}
          >
            <span>{name() ?? ""}</span>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </div>
      <span class="border-t-muted -mx-2 my-1 hidden border-t sm:block" />
      <div class="flex w-full items-center gap-2 p-1 sm:flex-col sm:items-start sm:gap-1 sm:p-0">
        <For each={props.groups}>
          {(group) => (
            <>
              {group.name && (
                <span class="text-muted-foreground text-lg font-semibold">
                  {group.name}
                </span>
              )}
              <For each={group.links}>
                {(link) => (
                  <A
                    class={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      }),
                      location.pathname == link.href ? "bg-muted" : "",
                      "w-9 flex-none sm:w-full",
                    )}
                    href={link.href}
                  >
                    <span class="mr-auto hidden w-full text-left sm:block">
                      {link.name}
                    </span>
                    {link.icon}
                  </A>
                )}
              </For>
            </>
          )}
        </For>
      </div>
      <span class="border-t-muted -mx-2 mb-1 mt-auto hidden border-t sm:block" />
      <div class="flex w-auto items-center gap-2 p-1">
        <Suspense fallback={<Skeleton class="w-full rounded-lg" />}>
          <p class="text-muted-foreground hidden flex-auto overflow-hidden text-ellipsis text-wrap text-sm sm:block">
            {user()?.email}
          </p>
        </Suspense>
        <ColorModeToggle />
        <LogoutButton />
      </div>
    </nav>
  );
}
