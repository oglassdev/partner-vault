import { As } from "@kobalte/core";
import { useParams } from "@solidjs/router";
import { RefreshCw } from "lucide-solid";
import { CgOptions } from "solid-icons/cg";
import { For, Show } from "solid-js";
import { createResource, createSignal } from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import Help from "~/components/help";
import PartnerCreate from "~/components/partner/partner-create";
import PartnerDropdown from "~/components/partner/partner-dropdown";
import Search from "~/components/search";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import { Badge } from "~/components/ui/badge";
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
import { getDate, numberToHex } from "~/lib/utils";
import { ViewType } from "~/lib/view";

export default function Partners() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();
  const [_partners, { refetch: refetchPartners }] = createResource(
    async () =>
      handleError(
        await supabase
          .from("partners")
          .select(
            `
          *,
          partner_tags(
            tag_id,
            tags (*)
          )
          `,
          )
          .eq("team_id", team_id),
      )?.map(({ partner_tags, ...rest }) => ({
        ...rest,
        tags: partner_tags.map((tagRow) => tagRow.tags),
      })),
    {
      initialValue: [],
    },
  );
  const [search, setSearch] = createSignal("");
  const [viewType, setViewType] = createSignal<ViewType>("grid");
  const [filteredPartners, filterType, setFilterType] = filter(
    _partners,
    "name",
    {
      name: (name) => name.toLowerCase().includes(search().toLowerCase()),
      tags: (tags) => {
        return search().length > 0
          ? tags.find((tag) =>
              tag?.name.toLowerCase().includes(search().toLowerCase()),
            ) != null
          : true;
      },
      id: (id) => id.toLowerCase().includes(search().toLowerCase()),
    },
  );
  const [partners, sortType, setSortType] = sort(filteredPartners, "name", {
    name: (a, b) => a.localeCompare(b),
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
          onClick={refetchPartners}
        >
          <RefreshCw size={18} class="rotate-0 transition-all" />
          <span class="sr-only">Options</span>
        </Button>
        <PartnerCreate team_id={team_id} refresh={refetchPartners} />
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
                    <DropdownMenuRadioItem value="name">
                      Name
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="created_at">
                      Created
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
                    <DropdownMenuRadioItem value="tags">
                      Tags
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="id">ID</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <Help>
          The partners tab lists out all partners associated with the team. The
          search, filter, and sort options allow quick finding of partners.
        </Help>
      </DashboardTopBar>
      <SuspenseSpinner>
        <main class="flex min-h-full flex-auto overflow-auto">
          <Show
            when={partners().length ?? 0 > 0}
            fallback={<span class="m-auto flex">No results found</span>}
          >
            <Grid
              cols={1}
              colsMd={2}
              colsLg={3}
              class="max-h-fit w-full flex-none gap-2 p-2"
            >
              {
                <For each={partners()}>
                  {(partner) => (
                    <Card class="flex flex-col">
                      <CardHeader class="flex flex-row items-start justify-between space-y-0">
                        <CardTitle class="flex flex-auto flex-col gap-1">
                          <span class="overflow-hidden">{partner.name}</span>
                          <div class="flex flex-row flex-wrap gap-1">
                            <For each={partner.tags}>
                              {(tag) => (
                                <Badge
                                  variant="outline"
                                  class="dark:border-opacity-50"
                                  style={{
                                    "border-color": numberToHex(
                                      tag?.color ?? 0,
                                    ),
                                  }}
                                >
                                  {tag?.name}
                                </Badge>
                              )}
                            </For>
                          </div>
                        </CardTitle>
                        <PartnerDropdown
                          partner={partner}
                          tags={partner.tags.flatMap((tag) =>
                            tag != null ? [tag] : [],
                          )}
                          refresh={refetchPartners}
                        />
                      </CardHeader>
                      <CardFooter class="mt-auto flex flex-col items-start font-semibold">
                        <span class="text-muted-foreground font-medium">
                          {getDate(partner.created_at).toLocaleString()}
                        </span>
                        <span>{partner.type}</span>
                      </CardFooter>
                    </Card>
                  )}
                </For>
              }
            </Grid>
          </Show>
        </main>
      </SuspenseSpinner>
    </div>
  );
}
