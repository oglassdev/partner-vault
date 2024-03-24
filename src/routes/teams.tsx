import ColorModeToggle from "~/components/color-mode-toggle.tsx";
import Help from "~/components/help.tsx";
import { Button, buttonVariants } from "~/components/ui/button.tsx";
import { MoreVertical } from "lucide-solid";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
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
import Invites from "~/components/teams/invites.tsx";
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
import { A, useNavigate } from "@solidjs/router";
import { cn } from "~/lib/utils";
import { ViewType } from "~/lib/view";
import { Grid } from "~/components/ui/grid";
import Search from "~/components/search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getProfile, getUser } from "~/lib/database/supabase-user";
import { handleError } from "~/lib/database/database";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import TeamCreation from "~/components/teams/team-creation";
import { filter } from "~/lib/filter";

export default function Teams() {
  const supabase = useSupabaseContext();
  const [_teams, { refetch }] = createResource(
    async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session == null) return [];
      return (
        handleError(
          await supabase
            .from("user_teams")
            .select("*, teams(*)")
            .eq("user_id", session.user.id),
        )?.flatMap((relation) =>
          relation.teams != null ? [relation.teams] : [],
        ) ?? []
      );
    },
    {
      initialValue: [],
    },
  );
  const [search, setSearch] = createSignal("");
  const [viewType, setViewType] = createSignal<ViewType>("grid");
  const [teams] = filter(_teams, "name", {
    name: (name) =>
      name.toLowerCase().includes(search().toLowerCase()) ?? false,
  });
  const [user] = createResource(getUser);
  const leaveTeam = async (id: string, name: string) => {
    const u = user();
    if (u == null) return;
    handleError(
      await supabase
        .from("user_teams")
        .delete()
        .eq("team_id", id)
        .eq("user_id", u.id),
    );
    refetch();
    showToast({
      title: "Left team " + name,
    });
  };

  const navigate = useNavigate();

  const [profile] = createResource(getProfile);

  createEffect(() => {
    const p = profile();
    if (p == null) {
      if (profile.loading) return;
      navigate("/createProfile");
    }
  });

  return (
    <>
      <main class="flex h-full w-full flex-col">
        <header>
          <div
            class="border-muted bg-background sticky top-0 z-50 flex
          w-full flex-row items-center justify-center gap-2 border-b p-2"
          >
            <span class="hidden w-auto min-w-14 md:flex" />
            <Search value={search()} setValue={setSearch} />
            <ColorModeToggle />
            <Help>
              If you aren't in a team, you can either create one or ask for an
              invite.
            </Help>
            <Invites refresh={refetch} />
            <LogoutButton />
            <TeamCreation refresh={refetch} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <As
                  component={Button}
                  variant="ghost"
                  size="sm"
                  class="h-9 w-9 flex-none px-0"
                >
                  <MoreVertical size={16} class="rotate-0 transition-all" />
                  <span class="sr-only">Options</span>
                </As>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuRadioGroup
                    value={viewType()}
                    onChange={setViewType}
                  >
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
          </div>
        </header>
        <SuspenseSpinner>
          <Show
            when={viewType() === "grid"}
            fallback={
              <div class="flex-auto overflow-auto overscroll-auto">
                <Table class="p-2">
                  <TableBody>
                    <For each={teams()}>
                      {(team) => (
                        <TableRow>
                          <TableCell class="mr-4 truncate">
                            {team.name}
                          </TableCell>
                          <TableCell class="flex justify-end gap-2">
                            <A
                              href={`/team/${team.id}`}
                              class={cn(
                                buttonVariants({
                                  variant: "secondary",
                                  size: "sm",
                                }),
                                "flex-none",
                              )}
                            >
                              Select Team
                            </A>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <As
                                  component={Button}
                                  variant="ghost"
                                  size="sm"
                                  class="h-9 w-9 flex-none"
                                >
                                  <MoreVertical
                                    size={20}
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
              class="w-full gap-2 overflow-auto overscroll-auto p-2"
              cols={1}
              colsSm={2}
              colsMd={3}
              colsLg={4}
            >
              <For each={teams()}>
                {(team) => {
                  const { name, id, owner } = team;
                  return (
                    <Card class="flex flex-col">
                      <CardHeader class="flex flex-row items-start justify-between gap-2 space-y-0">
                        <CardTitle class="flex flex-auto flex-col gap-1">
                          {name}
                        </CardTitle>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <As
                                  component={DropdownMenuItem}
                                  closeOnSelect={false}
                                  disabled={user()?.id == owner}
                                >
                                  <span class="w-full font-medium text-red-500">
                                    Leave
                                  </span>
                                </As>
                              </DialogTrigger>
                              <DialogContent class="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Are you sure?</DialogTitle>
                                  <DialogDescription>
                                    Leaving{" "}
                                    <span class="text-primary font-semibold">
                                      {name}
                                    </span>
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    onClick={() => leaveTeam(id, name)}
                                    variant="destructive"
                                  >
                                    Leave
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardFooter class="mt-auto flex flex-row gap-2">
                        <A
                          href={`/team/${team.id}`}
                          class={cn(
                            buttonVariants({ variant: "secondary" }),
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
        </SuspenseSpinner>
      </main>
    </>
  );
}
