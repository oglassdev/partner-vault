import { As } from "@kobalte/core";
import { useParams } from "@solidjs/router";
import { RefreshCw } from "lucide-solid";
import { CgOptions } from "solid-icons/cg";
import { For, Show } from "solid-js";
import { createResource, createSignal } from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import Help from "~/components/help";
import Search from "~/components/search";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Grid } from "~/components/ui/grid";
import UserInvite from "~/components/user/user-invite";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { handleError } from "~/lib/database/database";
import { filter } from "~/lib/filter";
import { sort } from "~/lib/sort";

export default function Users() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();
  const [owner] = createResource(
    async () =>
      handleError(
        await supabase
          .from("teams")
          .select("owner")
          .eq("id", team_id)
          .limit(1)
          .maybeSingle(),
      )?.owner,
  );
  const [_users, { refetch: refetchUsers }] = createResource(
    async () =>
      handleError(
        await supabase
          .from("profiles")
          .select(
            `
              *,
              user_teams!inner(
                  user_id
              )
              `,
          )
          .in("user_teams.team_id", [team_id]),
      ),
    {
      initialValue: [],
    },
  );
  const [search, setSearch] = createSignal("");
  const [filteredUsers, filterType, setFilterType] = filter(
    _users,
    "username",
    {
      username: (name) =>
        name?.toLowerCase().includes(search().toLowerCase()) ?? false,
      public_email: (email) =>
        email?.toLowerCase().includes(search().toLowerCase()) ?? false,
    },
  );
  const [users, sortType, setSortType] = sort(filteredUsers, "username", {
    username: (a, b) => a?.localeCompare(b ?? "") ?? 0,
    public_email: (a, b) => a?.localeCompare(b ?? "") ?? 0,
  });
  return (
    <div class="h-full w-full overflow-auto">
      <DashboardTopBar>
        <Search value={search()} setValue={setSearch} />
        <Button
          variant="ghost"
          size="sm"
          class="w-9 flex-none px-0"
          onClick={refetchUsers}
        >
          <RefreshCw size={18} class="rotate-0 transition-all" />
          <span class="sr-only">Options</span>
        </Button>
        <UserInvite />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <As
              component={Button}
              variant="ghost"
              size="sm"
              class="w-9 flex-none px-0"
            >
              <CgOptions size={18} class="rotate-0 transition-all" />
              <span class="sr-only">Options</span>
            </As>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub overlap>
              <DropdownMenuSubTrigger>Sort</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={sortType()}
                    onChange={setSortType}
                  >
                    <DropdownMenuRadioItem value="username">
                      Username
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="public_email">
                      Email
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub overlap>
              <DropdownMenuSubTrigger>Filter</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={filterType()}
                    onChange={setFilterType}
                  >
                    <DropdownMenuRadioItem value="username">
                      Username
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="public_email">
                      Public Email
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <Help>
          The users tab lists out all users in the team. The search, filter, and
          sort options allow quick finding of the users.
        </Help>
      </DashboardTopBar>
      <SuspenseSpinner>
        <main class="flex flex-auto overflow-auto">
          <Show
            when={users()?.length ?? 0 > 0}
            fallback={<span class="m-auto flex">No results found</span>}
          >
            <Grid
              cols={1}
              colsMd={2}
              colsLg={3}
              class="max-h-fit w-full flex-none gap-2 p-2"
            >
              <For each={users()}>
                {(user) => (
                  <Card class="flex flex-col">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle class="flex flex-col font-medium">
                        <span class="mt-auto">{user.display_name}</span>
                        <span class="text-muted-foreground text-md font-normal">
                          @{user.username}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="flex flex-auto flex-col">
                      {owner() == user.id && (
                        <span class="font-semibold">Owner</span>
                      )}
                      <span class="mt-auto">{user.public_email}</span>
                    </CardContent>
                  </Card>
                )}
              </For>
            </Grid>
          </Show>
        </main>
      </SuspenseSpinner>
    </div>
  );
}
