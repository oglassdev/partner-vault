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
import TagCreate from "~/components/tags/tag-create";
import TagDropdown from "~/components/tags/tag-dropdown";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { handleError } from "~/lib/database/database";
import { filter } from "~/lib/filter";
import { sort } from "~/lib/sort";
import { getDate, numberToHex } from "~/lib/utils";

export default function Tags() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();
  const [_tags, { refetch: refetchTags }] = createResource(async () =>
    handleError(
      await supabase
        .from("tags")
        .select(
          `
          *
          `,
        )
        .eq("team_id", team_id),
    ),
  );
  const [search, setSearch] = createSignal("");
  const [filteredTags, filterType, setFilterType] = filter(_tags, "name", {
    name: (name) => name.toLowerCase().includes(search().toLowerCase()),
    description: (description) =>
      search().length > 0
        ? description?.toLowerCase().includes(search().toLowerCase()) ?? false
        : true,
  });
  const [tags, sortType, setSortType] = sort(filteredTags, "name", {
    name: (a, b) => a.localeCompare(b),
    color: (a, b) => (a ?? 0) - (b ?? 0),
    created_at: (a, b) =>
      getDate(a).getMilliseconds() - getDate(b).getMilliseconds(),
  });
  return (
    <div class="h-full w-full overflow-auto">
      <DashboardTopBar>
        <Search value={search()} setValue={setSearch} />
        <Button
          variant="ghost"
          size="sm"
          class="w-9 flex-none px-0"
          onClick={refetchTags}
        >
          <RefreshCw size={18} class="rotate-0 transition-all" />
          <span class="sr-only">Options</span>
        </Button>
        <TagCreate team_id={team_id} refresh={refetchTags} />
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
                    <DropdownMenuRadioItem value="name">
                      Name
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="color">
                      Color
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="created_at">
                      Created At
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
                    <DropdownMenuRadioItem value="name">
                      Name
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="description">
                      Description
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <Help>
          The tags pags lists out all tags associated with the team. The search,
          filter, and sort options allow quick finding of tags.
        </Help>
      </DashboardTopBar>
      <SuspenseSpinner>
        <main class="flex flex-auto overflow-auto">
          <Show
            when={tags()?.length ?? 0 > 0}
            fallback={<span class="m-auto flex">No results found</span>}
          >
            <Grid
              cols={1}
              colsMd={2}
              colsLg={3}
              class="max-h-fit w-full flex-none gap-2 p-2"
            >
              <For each={tags()}>
                {(tag) => (
                  <Card
                    class={`flex flex-col dark:border-opacity-50`}
                    style={{ "border-color": numberToHex(tag.color ?? 0) }}
                  >
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle class="font-medium">{tag.name}</CardTitle>
                      <TagDropdown tag={tag} refresh={refetchTags} />
                    </CardHeader>
                    <CardContent class="flex flex-col">
                      {tag.description}
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
