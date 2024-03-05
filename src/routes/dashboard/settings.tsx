import { As } from "@kobalte/core";
import { useParams } from "@solidjs/router";
import { RefreshCw } from "lucide-solid";
import { CgOptions } from "solid-icons/cg";
import { For, Show } from "solid-js";
import { createResource, createSignal } from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import Help from "~/components/dialog/help";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { handleError } from "~/lib/database/database";
import { getUser } from "~/lib/database/supabase-user";

export default function Settings() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();
  const user = createResource(getUser);
  const [team, { refetch: refetchSettings }] = createResource(async () =>
    handleError(
      await supabase
        .from("teams")
        .select(
          `
              *
              `,
        )
        .eq("id", team_id)
        .limit(1)
        .single(),
    ),
  );
  return (
    <div class="h-full w-full overflow-auto">
      <DashboardTopBar>
        <Button
          variant="ghost"
          size="sm"
          class="w-9 flex-none px-0"
          onClick={refetchSettings}
        >
          <RefreshCw size={18} class="rotate-0 transition-all" />
          <span class="sr-only">Options</span>
        </Button>
        <Help>
          The settings tab allows changing of team settings. Only the owner has
          edit access, while members can view settings.
        </Help>
      </DashboardTopBar>
      <SuspenseSpinner>
        <main class="flex min-h-full flex-auto flex-col overflow-auto p-2">
          <Label for="name" class="text-muted-foreground pb-2">
            Name
          </Label>
          <div class="flex w-full flex-none flex-row gap-2">
            <Input placeholder="Team name" value={team()?.name} id="name" />
            <Button>Save</Button>
          </div>
        </main>
      </SuspenseSpinner>
    </div>
  );
}
