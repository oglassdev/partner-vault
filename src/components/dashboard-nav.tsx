import { A, useLocation, useNavigate, useParams } from "@solidjs/router";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  For,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { JSX } from "solid-js";
import { Select } from "~/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import LogoutButton from "./logout-button";
import ColorModeToggle from "./color-mode-toggle";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { showToast } from "./ui/toast";
import { Database } from "../../database.types";
import { Skeleton } from "./ui/skeleton";
import { getUser } from "~/lib/database/supabase-user";

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
  type TeamRow = Database["public"]["Tables"]["teams"]["Row"] & {
    disabled: boolean;
  };

  const location = useLocation();
  const supabase = useSupabaseContext();
  const { team_id } = useParams();
  const navigate = useNavigate();

  const [teams] = createResource<TeamRow[]>(
    async () => {
      const { data, error } = await supabase.from("teams").select("*");
      if (error) {
        showToast({
          title: "Error: " + error.code,
          description: error.message,
        });
      }
      return (
        data?.map((team) => {
          return { ...team, disabled: false };
        }) ?? []
      );
    },
    {
      initialValue: [],
    },
  );

  const [user] = createResource(getUser);

  const [team, _setTeam] = createSignal<TeamRow>();
  createEffect(() => {
    _setTeam(teams().find((t) => t.id == team_id));
  });
  const setTeam = (t: TeamRow) => {
    if (t == null) return;
    navigate("/teams");
    navigate("/team/" + t?.id);
  };

  return (
    <nav
      class="
      border-muted flex h-12 w-full flex-none flex-row
      gap-1 border-t bg-opacity-15 p-2 transition-all sm:h-full sm:w-64 sm:flex-col sm:border-r sm:pt-8
      "
    >
      <div class="flex flex-none flex-row gap-2">
        <Select<TeamRow>
          value={team()}
          onChange={setTeam}
          options={teams()}
          optionValue={"id"}
          optionTextValue={"name"}
          optionDisabled={"disabled"}
          placeholder="Select a team…"
          class="flex-auto"
          itemComponent={(props) => {
            return (
              <SelectItem item={props.item}>
                {props.item.rawValue.name}
              </SelectItem>
            );
          }}
        >
          <SelectTrigger
            aria-label="Team"
            class="hidden h-9 flex-none items-center overflow-hidden text-ellipsis text-left sm:flex"
          >
            <SelectValue<TeamRow> class="max-w-52 truncate">
              {(state) => state.selectedOption()?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </div>
      <span class="border-t-muted -mx-2 my-2 hidden border-t sm:block" />
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
