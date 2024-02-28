import { RouteDataFuncArgs } from "@solidjs/router";
import { Session } from "@supabase/supabase-js";
import { ResourceReturn, createResource } from "solid-js";
import { showToast } from "~/components/ui/toast";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { Database } from "../../database.types";

export type TeamDataType = {
  authenticated_user: {
    session: ResourceReturn<Session | undefined>;
    profile: ResourceReturn<
      Database["public"]["Tables"]["profiles"]["Row"] | undefined
    >;
  };
  team: ResourceReturn<
    Database["public"]["Tables"]["teams"]["Row"] | undefined
  >;
  partners: ResourceReturn<Database["public"]["Tables"]["partners"]["Row"][]>;
  users: ResourceReturn<Database["public"]["Tables"]["profiles"]["Row"][]>;
  refresh_all: () => void;
};
export default function TeamData({ params }: RouteDataFuncArgs): TeamDataType {
  const supabase = useSupabaseContext();
  const team_id = params.team_id;

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) showErrorToast(error.name, error.message);
    return data?.session ?? undefined;
  };
  const sessionResource = createResource(getSession);
  const profile = createResource(async () => {
    const session = await getSession();
    if (session === undefined) return;

    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .limit(1)
      .single();

    if (error) showErrorToast(error.code, error.message);

    return data ?? undefined;
  });

  const team = createResource(async () => {
    const { data, error } = await supabase
      .from("teams")
      .select()
      .eq("id", team_id)
      .limit(1)
      .single();

    if (error) showErrorToast(error.code, error.message);

    return data ?? undefined;
  });
  const partners = createResource(async () => {
    const { data, error } = await supabase
      .from("partners")
      .select()
      .eq("team_id", team_id);
    if (error) showErrorToast(error.code, error.message);

    return data ?? [];
  });

  const users = createResource(async () => {
    const { data, error } = await supabase
      .from("user_teams")
      .select(
        `
        *,
        profiles!inner(*)
      `,
      )
      .eq("team_id", team_id);
    if (error) showErrorToast(error.code, error.message);

    return (
      data?.flatMap((user_teams) => {
        const profile = user_teams.profiles;
        return profile ? [profile] : [];
      }) ?? []
    );
  });

  return {
    authenticated_user: {
      session: sessionResource,
      profile,
    },
    team,
    partners,
    users,
    refresh_all() {
      this.authenticated_user.profile[1].refetch();
      this.authenticated_user.session[1].refetch();
      this.team[1].refetch();
      this.partners[1].refetch();
      this.users[1].refetch();
    },
  };
}

function showErrorToast(name: string, description: string) {
  showToast({
    variant: "destructive",
    title: `Error: ${name}`,
    description: description,
  });
}
