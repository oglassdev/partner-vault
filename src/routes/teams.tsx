import ColorModeToggle from "~/components/color-mode-toggle.tsx";
import Help from "~/components/dialog/help.tsx";
import { Input } from "~/components/ui/input.tsx";
import { Button, buttonVariants } from "~/components/ui/button.tsx";
import { Loader, Plus } from "lucide-solid";
import { createResource, createSignal, For, Show, Suspense } from "solid-js";
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

type View = "grid" | "table";
export default function Teams() {
	const supabase = useSupabaseContext();
	const [teams, _] = createResource(async () => {
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
	const [viewType, setViewType] = createSignal<View>("grid");
	return (
		<main class="flex flex-col p-4 w-full h-full gap-2">
			<header class="mt-4 flex flex-row gap-2">
				<Input placeholder="Search Teams" />
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
			<Suspense fallback={<Loader />}>
				<Show
					when={viewType() === "grid"}
					fallback={
						<div class="overflow-auto overscroll-auto flex-auto">
							<Table>
								<TableBody>
									<For each={teams()}>
										{(team) => (
											<TableRow>
												<TableCell class="font-medium">{team.name}</TableCell>
												<TableCell class="gap-2 flex justify-end">
												  <A href={`/team/${team.id}`} class={cn(buttonVariants({ variant: "outline" }))}>
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
																<span class="w-full text-center text-red-500 font-medium">
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
					<div class="flex flex-wrap flex-row overscroll-auto overflow-auto w-full gap-2">
						<For each={teams()}>
							{(team) => {
								const { name } = team;
								return (
									<Card class="w-56 h-auto flex flex-col">
										<CardHeader class="p-4 flex flex-row">
											<CardTitle>{name}</CardTitle>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<As
														component={Button}
														variant="ghost"
														size="icon"
														class="flex-none ml-auto w-9 h-9"
													>
														<BsThreeDots size={15} class="rotate-90" />
														<span class="sr-only">Options</span>
													</As>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuItem>
														<span class="w-full text-center text-red-500 font-medium">
															Leave Team
														</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</CardHeader>
										<CardFooter class="flex flex-row gap-2 p-4 pt-0 mt-auto">
											<A href={`/team/${team.id}`} class={cn(buttonVariants({ variant: "outline" }), "flex-auto")}>
												Select Team
											</A>
										</CardFooter>
									</Card>
								);
							}}
						</For>
					</div>
				</Show>
			</Suspense>
			<footer class="w-full flex flex-row mt-auto gap-1 items-center">
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
