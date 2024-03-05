import ColorModeToggle from "~/components/color-mode-toggle.tsx";
import Help from "~/components/dialog/help.tsx";
import { Input } from "~/components/ui/input.tsx";
import { Button, buttonVariants } from "~/components/ui/button.tsx";
import { Loader, Plus } from "lucide-solid";
import {
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.tsx";
import { As } from "@kobalte/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.tsx";
import { CgOptions } from "solid-icons/cg";
import Invites from "~/components/dialog/invites.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/components/ui/table.tsx";
import { useSupabaseContext } from "~/lib/context/supabase-context.ts";
import { showToast } from "~/components/ui/toast.tsx";
import LogoutButton from "~/components/logout-button.tsx";
import { BsThreeDots } from "solid-icons/bs";
import { A } from "@solidjs/router";
import { cn } from "~/lib/utils";
import { ViewType } from "~/lib/view";
import { Grid } from "~/components/ui/grid";

export default function Teams() {
  const supabase = useSupabaseContext();
  const [_teams] = createResource(async () => {
    const { data, error } = await supabase.from("teams").select();
    if (error) {
      showToast({
        title: "Error: " + error.code,
        description: error.message,
      });
      return;
    }
    return data;
  });
  const [search, setSearch] = createSignal("");
  const [viewType, setViewType] = createSignal<ViewType>("grid");
  const teams = createMemo(() =>
    _teams()?.filter((team) => team.name.toLowerCase().includes(search())),
  );
  return (
    <main class="flex h-full w-full flex-col gap-2 p-4">
      <header class="mt-4 flex flex-row gap-2">
        <Input
          placeholder="Search Teams"
          value={search()}
          onInput={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
        <Button variant="outline" size="icon" class="flex-none">
          <Plus size={22} />
          <span class="sr-only">Create Team</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <As
              component={Button}
              variant="outline"
              size="icon"
              class="flex-none"
            >
              <CgOptions size={22} class="rotate-0 transition-all" />
              <span class="sr-only">Options</span>
            </As>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup value={viewType()} onChange={setViewType}>
                <DropdownMenuRadioItem value="grid">
                  Grid View
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="table">
                  Table View
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Suspense
        fallback={
          <div class="m-auto">
            <Loader class="animate-spin" color="#999" />
          </div>
        }
      >
        <Show
          when={viewType() === "grid"}
          fallback={
            <div class="flex-auto overflow-auto overscroll-auto">
              <Table>
                <TableBody>
                  <For each={teams()}>
                    {(team) => (
                      <TableRow>
                        <TableCell class="mr-4 truncate">{team.name}</TableCell>
                        <TableCell class="flex justify-end gap-2">
                          <A
                            href={`/team/${team.id}`}
                            class={cn(
                              buttonVariants({ variant: "outline" }),
                              "flex-none",
                            )}
                          >
                            Select Team
                          </A>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <As
                                component={Button}
                                variant="outline"
                                size="icon"
                                class="flex-none"
                              >
                                <CgOptions
                                  size={22}
                                  class="rotate-0 transition-all"
                                />
                                <span class="sr-only">Options</span>
                              </As>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <span class="w-full text-center font-medium text-red-500">
                                  Leave Team
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )}
                  </For>
                </TableBody>
              </Table>
            </div>
          }
        >
          <Grid
            class="w-full gap-2 overflow-auto overscroll-auto"
            cols={1}
            colsSm={2}
            colsMd={3}
            colsLg={4}
          >
            <For each={teams()}>
              {(team) => {
                const { name } = team;
                return (
                  <Card class="flex h-auto flex-col">
                    <CardHeader class="flex flex-row p-4">
                      <CardTitle>{name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <As
                            component={Button}
                            variant="ghost"
                            size="icon"
                            class="ml-auto h-9 w-9 flex-none"
                          >
                            <BsThreeDots size={15} class="rotate-90" />
                            <span class="sr-only">Options</span>
                          </As>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <span class="w-full text-center font-medium text-red-500">
                              Leave Team
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardFooter class="mt-auto flex flex-row gap-2 p-4 pt-0">
                      <A
                        href={`/team/${team.id}`}
                        class={cn(
                          buttonVariants({ variant: "outline" }),
                          "flex-auto",
                        )}
                      >
                        Select Team
                      </A>
                    </CardFooter>
                  </Card>
                );
              }}
            </For>
          </Grid>
        </Show>
      </Suspense>
      <footer class="mt-auto flex w-full flex-row items-center gap-1">
        <ColorModeToggle />
        <Help>
          If you aren't in a team, you can either create one or ask for an
          invite.
        </Help>
        <LogoutButton />
        <span class="mx-auto" />
        <Invites />
      </footer>
    </main>
  );
}
