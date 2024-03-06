import { As } from "@kobalte/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-solid";
import { createResource, createSignal } from "solid-js";
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxTrigger,
} from "../ui/combobox";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { showToast } from "../ui/toast";
import { ProfileRow, handleError } from "~/lib/database/database";
import { useParams } from "@solidjs/router";

export default function UserInvite() {
  const supabase = useSupabaseContext();

  const { team_id } = useParams();

  const [open, setOpen] = createSignal(false);

  const [search, setSearch] = createSignal("");

  const [profiles, { mutate, refetch }] = createResource(
    async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session == null) {
        showToast({
          title: "No session was found.",
          variant: "destructive",
        });
        return [];
      }
      return (
        handleError(
          await supabase
            .from("profiles")
            .select()
            .neq("id", session.user.id)
            .or(`display_name.ilike.${search()}%,username.ilike.${search()}%`)
            .limit(12),
        ) ?? []
      );
    },
    {
      initialValue: [],
    },
  );

  const [selectedProfile, setSelectedProfile] = createSignal<ProfileRow>();

  const handleSubmit = async () => {
    const profile = selectedProfile();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session == null) {
      showToast({
        title: "No session was found.",
        variant: "destructive",
      });
      return [];
    }

    showToast({
      title: JSON.stringify(profile),
      variant: "destructive",
    });
    if (profile == null) return;

    handleError(
      await supabase.from("invites").insert({
        from_id: session.user.id,
        to_id: profile.id,
        team_id,
      }),
    );
    setOpen(false);
  };

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <DialogDescription class="flex flex-col gap-1">
          <Combobox
            options={profiles()}
            optionValue={"id"}
            optionLabel={"display_name"}
            value={selectedProfile()}
            onSelect={setSelectedProfile}
            defaultFilter={() => true}
            itemComponent={(props) => (
              <ComboboxItem item={props.item}>
                <ComboboxItemLabel class="flex flex-col">
                  <span>{props.item.rawValue.display_name}</span>
                  <span class="text-muted-foreground">
                    @{props.item.rawValue.username}
                  </span>
                </ComboboxItemLabel>
                <ComboboxItemIndicator />
              </ComboboxItem>
            )}
            placeholder="Add tags..."
          >
            <ComboboxControl aria-label="Tags">
              <div class="flex w-full flex-wrap gap-1">
                <ComboboxInput
                  onInput={(e) => {
                    mutate([]);
                    setSearch(e.currentTarget.value);
                    refetch();
                  }}
                />
              </div>
              <ComboboxTrigger />
            </ComboboxControl>
            <ComboboxContent class="max-h-64 overflow-auto" />
          </Combobox>
          <Button class="w-full" type="submit" onClick={handleSubmit}>
            Invite
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
