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
import { Check, Plus } from "lucide-solid";
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { showToast } from "../ui/toast";
import { ProfileRow, handleError } from "~/lib/database/database";
import { useParams } from "@solidjs/router";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { SuspenseSpinner } from "../suspense-spinner";

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
      return handleError(
        await supabase.rpc("search_invitable_profiles", {
          search: search(),
          user_id: session.user.id,
          current_team_id: team_id,
        }),
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
      setOpen(false);
      return;
    }

    if (profile == null) {
      setOpen(false);
      return;
    }

    handleError(
      await supabase.from("invites").insert({
        from_id: session.user.id,
        to_id: profile.id,
        team_id,
      }),
    );
    setOpen(false);
    showToast({
      title: "Invited " + profile.display_name,
    });
    refetch();
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
          <Input
            placeholder="Search"
            onInput={(e) => {
              setSearch(e.currentTarget.value);
              refetch();
            }}
            autocorrect="off"
            autocomplete="off"
            autocapitalize="off"
          />
          <Card class="h-64 overflow-auto p-0">
            <SuspenseSpinner>
              <CardContent class="m-0 flex flex-col p-2">
                <Show when={profiles().length == 0}>
                  <span class="m-auto">No users found.</span>
                </Show>
                <For each={profiles()}>
                  {(profile) => (
                    <Button
                      variant="ghost"
                      class={`flex h-auto w-full flex-row p-0 text-left ${selectedProfile() == profile && "bg-muted"}`}
                      onClick={() => {
                        setSelectedProfile(
                          selectedProfile() == profile ? undefined : profile,
                        );
                      }}
                    >
                      <div class="flex flex-auto flex-col p-2">
                        <h3>{profile.display_name}</h3>
                        <p class="text-muted-foreground font-normal">
                          @{profile.username}
                        </p>
                      </div>
                      <Show when={selectedProfile() == profile}>
                        <Check class="text-muted-foreground mx-2 my-auto h-6 w-6 flex-none" />
                      </Show>
                    </Button>
                  )}
                </For>
              </CardContent>
            </SuspenseSpinner>
          </Card>
          <Button class="w-full" type="submit" onClick={handleSubmit}>
            Invite
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
