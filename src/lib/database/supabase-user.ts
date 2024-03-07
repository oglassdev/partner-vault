import { User } from "@supabase/supabase-js";
import { useSupabaseContext } from "../context/supabase-context";
import { ProfileRow, handleError } from "./database";

export async function getUser(): Promise<User | null> {
  const { data, error } = await useSupabaseContext().auth.getUser();
  if (error) {
    //toastError("Failed to retrieve user", error.message);
    return null;
  }
  return data?.user;
}

export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = useSupabaseContext();
  const user = await getUser();
  if (user == null) return null;
  return handleError(
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .limit(1)
      .maybeSingle(),
  );
}
