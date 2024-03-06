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
import { createResource, For } from "solid-js";
import { Database } from "../../../database.types.ts";
import { useSupabaseContext } from "~/lib/context/supabase-context.ts";
import { showToast } from "~/components/ui/toast.tsx";

export default function Invites() {
  const supabase = useSupabaseContext();
  const [invites] = createResource<
    Database["public"]["Tables"]["invites"]["Row"][]
  >(async () => {
    const { data, error } = await supabase.from("invites").select();
    if (error) {
      showToast({
        title: `Error: ${error.code}`,
        description: error.message,
      });
    }
    return data!;
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <As
          component={Button}
          variant="ghost"
          size="sm"
          class="relative w-9 flex-none px-0"
        >
          <MailboxIcon size={24} class="rotate-0 transition-all" />
          <span class="absolute -right-1 -top-1 rounded-full bg-red-400 px-1 py-0.5 text-xs dark:bg-red-500">
            {invites.length}
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
                    <TableCell class="font-medium">{invite.team_id}</TableCell>
                    <TableCell class="flex justify-end gap-2">
                      <Button variant="ghost">Accept</Button>
                      <Button variant="destructive">Decline</Button>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </DialogDescription>
        <DialogFooter>
          <Button variant="ghost" disabled={invites()?.length == 0}>
            Accept All
          </Button>
          <Button variant="destructive" disabled={invites()?.length == 0}>
            Decline All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
