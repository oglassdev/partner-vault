import { Button } from "~/components/ui/button.tsx";
import { LogOut } from "lucide-solid";
import { useSupabaseContext } from "~/lib/context/supabase-context.ts";
import { showToast } from "~/components/ui/toast.tsx";
import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import { As } from "@kobalte/core";

export default function LogoutButton() {
  const supabase = useSupabaseContext();
  const navigate = useNavigate();
  const logout = async () => {
    setConfirmShown(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast({
        title: "Error while logging out",
        description: error.message,
      });
      return;
    }
    showToast({
      title: "Successfully logged out",
    });
    navigate("/");
  };

  const [confirmShown, setConfirmShown] = createSignal(false);

  return (
    <Dialog open={confirmShown()} onOpenChange={setConfirmShown}>
      <DialogTrigger asChild>
        <As
          component={Button}
          variant="ghost"
          size="sm"
          class="w-9 flex-none px-0"
        >
          <LogOut size={20} class="rotate-0 transition-all" />
          <span class="sr-only">Log out</span>
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmShown(false);
            }}
          >
            No
          </Button>
          <Button variant="destructive" onClick={logout}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
