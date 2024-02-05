import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "~/components/ui/dialog.tsx";
import {As} from "@kobalte/core";
import {Button} from "~/components/ui/button.tsx";
import {MailboxIcon} from "lucide-solid";
import {Table, TableBody, TableCell, TableRow} from "~/components/ui/table.tsx";
import {createResource, For} from "solid-js";
import {Database} from "../../../database.types.ts";
import {useSupabaseContext} from "~/lib/context/supabase-context.ts";
import {showToast} from "~/components/ui/toast.tsx";

export default function Invites() {
    const supabase = useSupabaseContext()
    const [invites] = createResource<Database["public"]["Tables"]["invites"]["Row"][]>(async () => {
        const {data, error} = await supabase.from("invites").select()
        if (error) {
            showToast({
                title: `Error: ${error.code}`,
                description: error.message
            })
        }
        return data!
    })
    return <Dialog>
        <DialogTrigger asChild>
            <As component={Button} variant="ghost" size="sm" class="w-9 px-0 relative">
                <MailboxIcon size={24} class="rotate-0 transition-all"/>
                <span
                    class="absolute bg-red-400 dark:bg-red-500 -top-1 -right-1 py-0.5 px-1 rounded-full text-xs">{invites.length}</span>
                <span class="sr-only">Invites</span>
            </As>
        </DialogTrigger>
        <DialogContent>
            <DialogTitle>Team Invites</DialogTitle>
            <DialogDescription class="max-h-64 overscroll-auto overflow-auto">
                {invites()?.length == 0 && <span>You have no invites</span>}
                <Table>
                    <TableBody>
                        <For each={invites()}>
                            {invite => (
                                <TableRow>
                                    <TableCell class="font-medium">{invite.team_id}</TableCell>
                                    <TableCell class="gap-2 flex justify-end">
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
                <Button variant="ghost" disabled={invites()?.length == 0}>Accept All</Button>
                <Button variant="destructive" disabled={invites()?.length == 0}>Decline All</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}