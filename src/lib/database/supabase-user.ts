import { User } from "@supabase/supabase-js";
import { useSupabaseContext } from "../context/supabase-context";
import { ProfileRow, handleError, toastError } from "./database";

export async function getUser(): Promise<User | null> {
  const { data, error } = await useSupabaseContext().auth.getUser();
  if (error) {
    toastError("Failed to retrieve user", error.message);
    return null;
  }
  return data?.user;
}

export async function getProfile(): Promise<ProfileRow | null> {
  const user = await getUser();
  if (user == null) return null;
  return handleError(
    await useSupabaseContext()
      .from("profiles")
      .select("*")
      .limit(1)
      .eq("id", user.id)
      .single(),
  );
}
