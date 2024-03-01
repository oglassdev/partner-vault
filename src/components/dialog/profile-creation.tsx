import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog.tsx";
import ProfileCreationForm from "~/components/profile-creation-form.tsx";
import { createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function ProfileCreation() {
  const [open, setOpen] = createSignal(true);
  const navigate = useNavigate();
  createEffect(async () => {
    if (open()) return;
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    navigate("/");
  });
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ProfileCreationForm
          onComplete={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
