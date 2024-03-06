import { SubmitHandler, createForm } from "@modular-forms/solid";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { Setter, createResource, createSignal } from "solid-js";
import { getUser } from "~/lib/database/supabase-user";
import { handleError } from "~/lib/database/database";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-solid";
import { As } from "@kobalte/core";
import { useDialogContext } from "corvu/drawer";
import { showToast } from "../ui/toast";

export type TeamCreationFormType = {
  name: string;
};

export type TeamCreationProps = {
  refresh: () => void;
};

export function TeamCreationForm(
  props: TeamCreationProps & { onOpenChange: Setter<boolean> },
) {
  const [form, { Form, Field }] = createForm<TeamCreationFormType>();
  const supabase = useSupabaseContext();
  const [user] = createResource(getUser);

  const handleSubmit: SubmitHandler<TeamCreationFormType> = async (data) => {
    const u = user();
    console.log("submitting");
    if (u == null) return;
    const team = handleError(
      await supabase
        .from("teams")
        .insert({
          name: data.name,
          owner: u.id,
        })
        .select()
        .limit(1)
        .maybeSingle(),
    );
    if (team == null) {
      showToast({
        title: "Failed to create team",
        variant: "destructive",
      });
      return;
    }
    handleError(
      await supabase.from("user_teams").insert({
        user_id: u.id,
        team_id: team.id,
      }),
    );
    props.refresh();
    props.onOpenChange(false);
    showToast({
      title: "Created team " + team.name,
    });
  };
  return (
    <Form onSubmit={handleSubmit} class="flex flex-col gap-2">
      <Field name="name">
        {(field, fieldProps) => (
          <div>
            <Label for="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              value={field.value}
              {...fieldProps}
            />
          </div>
        )}
      </Field>
      <Button type="submit" class="w-full">
        Create
      </Button>
    </Form>
  );
}
export default function TeamCreation(props: TeamCreationProps) {
  const [open, setOpen] = createSignal(false);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As
          component={Button}
          variant="ghost"
          type="submit"
          size="sm"
          class="h-9 w-9 flex-none px-0"
        >
          <Plus size={20} />
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>
        <TeamCreationForm {...props} onOpenChange={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
