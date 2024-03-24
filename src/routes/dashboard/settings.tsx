import { useNavigate, useParams } from "@solidjs/router";
import { Loader, RefreshCw } from "lucide-solid";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import Help from "~/components/help";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { showToast } from "~/components/ui/toast";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { handleError } from "~/lib/database/database";
import { getUser } from "~/lib/database/supabase-user";
import { invoke } from "@tauri-apps/api/core";

export default function Settings() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();
  const navigate = useNavigate();
  const [user] = createResource(getUser);
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
  const [deleteInput, setDeleteInput] = createSignal("");

  const [name, setName] = createSignal("");

  const deleteTeam = async () => {
    handleError(await supabase.from("teams").delete().eq("id", team_id));
    navigate("/teams");
    showToast({
      title: "Deleted " + team()?.name,
    });
  };

  const [reportLoading, setReportLoading] = createSignal(false);
  const generateReport = async () => {
    setReportLoading(true);
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    if (token == null) return;
    try {
      await invoke("report_email", { teamId: team_id, token });
      showToast({
        title: "Email report successfully sent",
        description: "Check your email",
      });
    } catch (error) {
      showToast({
        title: "Error sending email:",
        description: error as any as string,
        variant: "destructive",
      });
    }
    setReportLoading(false);
  };

  const isOwner = createMemo(() => user()?.id == team()?.owner);

  createEffect(() => {
    setName(team()?.name ?? "");
  });

  const updateName = async () => {
    handleError(
      await supabase.from("teams").update({ name: name() }).eq("id", team_id),
    );
    showToast({
      title: "Updated name to " + name(),
    });
    refetchSettings();
  };

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
        <main class="flex flex-auto flex-col overflow-auto p-2">
          <Label for="name" class="text-muted-foreground pb-1">
            Name
          </Label>
          <div class="flex w-full flex-none flex-row gap-2">
            <Input
              placeholder={team()?.name}
              value={name()}
              disabled={!isOwner()}
              onInput={(e) => setName(e.currentTarget.value)}
              id="name"
            />
            <Button disabled={!isOwner()} onClick={updateName}>
              Save
            </Button>
          </div>
          <Label for="report" class="text-muted-foreground mt-4 pb-1">
            Reports
          </Label>
          <Button
            class="w-48"
            onClick={generateReport}
            disabled={reportLoading()}
          >
            {reportLoading() && <Loader class="mr-2 h-4 w-4 animate-spin" />}
            Generate a report
          </Button>

          <span class="bg-muted my-3 h-[1px] w-full" />
          <Label class="text-destructive pb-1">Danger Zone</Label>
          <Dialog>
            <DialogTrigger
              as={Button}
              id="delete"
              class="w-32"
              variant="destructive"
              disabled={!isOwner()}
            >
              Delete Team
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete {team()?.name}?</DialogTitle>
              <DialogDescription>
                Type the team name to confirm.
                <Input
                  placeholder={team()?.name}
                  value={deleteInput()}
                  onInput={(e) => {
                    setDeleteInput(e.currentTarget.value);
                  }}
                />
              </DialogDescription>
              <DialogFooter>
                <Button
                  disabled={deleteInput() != team()?.name}
                  variant={"destructive"}
                  class="transition-all"
                  onClick={deleteTeam}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SuspenseSpinner>
    </div>
  );
}
