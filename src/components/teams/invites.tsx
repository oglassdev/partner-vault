import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import { As } from "@kobalte/core";
import { Button } from "~/components/ui/button.tsx";
import { MailboxIcon } from "lucide-solid";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/components/ui/table.tsx";
import { createResource, createSignal, For } from "solid-js";
import { useSupabaseContext } from "~/lib/context/supabase-context.ts";
import { handleError } from "~/lib/database/database.ts";
import { getUser } from "~/lib/database/supabase-user";
import { showToast } from "../ui/toast";

export default function Invites(props: { refresh: () => void }) {
  const supabase = useSupabaseContext();
  const [user] = createResource(getUser);
  const [invites, { refetch }] = createResource(
    async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session == null) {
        showToast({
          title: "Failed to retrieve session.",
          variant: "destructive",
        });
        return [];
      }
      return (
        handleError(
          await supabase
            .from("invites")
            .select(
              `
      *,
      teams (*)
      `,
            )
            .eq("to_id", session.user.id),
        ) ?? []
      );
    },
    {
      initialValue: [],
    },
  );
  const acceptInvites = async (invites: string[]) => {
    handleError(await supabase.rpc("accept_team_invites", { teams: invites }));
    props.refresh();
    refetch();
  };
  const declineInvites = async (invites: string[]) => {
    const userId = user()?.id;
    if (userId == null) return;
    handleError(
      await supabase
        .from("invites")
        .delete()
        .contains("team_id", invites)
        .eq("to_id", userId),
    );
    props.refresh();
    refetch();
  };

  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As
          component={Button}
          variant="ghost"
          size="sm"
          class="relative w-9 flex-none px-0"
        >
          <MailboxIcon size={24} class="rotate-0 transition-all" />
          <span class="absolute -right-1 -top-1 rounded-full bg-red-400 px-1 py-0.5 text-xs dark:bg-red-500">
            {invites().length}
          </span>
          <span class="sr-only">Invites</span>
        </As>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Team Invites</DialogTitle>
        <DialogDescription class="max-h-64 overflow-auto overscroll-auto">
          {invites()?.length == 0 && <span>You have no invites</span>}
          <Table>
            <TableBody>
              <For each={invites()}>
                {(invite) => (
                  <TableRow>
                    <TableCell class="font-medium">
                      {invite.teams?.name}
                    </TableCell>
                    <TableCell class="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => acceptInvites([invite.team_id])}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => declineInvites([invite.team_id])}
                      >
                        Decline
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="ghost"
            disabled={invites()?.length == 0}
            onClick={() =>
              acceptInvites(invites()?.map((invite) => invite.team_id))
            }
          >
            Accept All
          </Button>
          <Button
            variant="destructive"
            disabled={invites()?.length == 0}
            onClick={() =>
              declineInvites(invites()?.map((invite) => invite.team_id))
            }
          >
            Decline All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
