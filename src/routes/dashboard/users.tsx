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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Grid } from "~/components/ui/grid";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { handleError } from "~/lib/database/database";
import { filter } from "~/lib/filter";
import { sort } from "~/lib/sort";
import { ViewType } from "~/lib/view";

export default function Users() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();
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
  const [viewType, setViewType] = createSignal<ViewType>("grid");
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
            <DropdownMenuGroup>
              <DropdownMenuGroupLabel>View</DropdownMenuGroupLabel>
              <DropdownMenuRadioGroup value={viewType()} onChange={setViewType}>
                <DropdownMenuRadioItem value="grid">
                  Grid View
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="table">
                  Table View
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
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
        <main class="flex min-h-full flex-auto overflow-auto">
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
                      <CardTitle class="font-medium">{user.username}</CardTitle>
                    </CardHeader>
                    <CardContent class="flex flex-col">
                      {user.public_email}
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
