import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Database } from "~/../database.types";
import { showToast } from "~/components/ui/toast";

export type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];
export type PartnerUpdate = Database["public"]["Tables"]["partners"]["Update"];
export type PartnerInsert = Database["public"]["Tables"]["partners"]["Insert"];

export type PartnerTagRow = Database["public"]["Tables"]["partner_tags"]["Row"];
export type PartnerTagUpdate =
  Database["public"]["Tables"]["partner_tags"]["Update"];
export type PartnerTagInsert =
  Database["public"]["Tables"]["partner_tags"]["Insert"];

export type TagRow = Database["public"]["Tables"]["tags"]["Row"];
export type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];
export type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export function handleError<T>(
  postgrestResponse: PostgrestSingleResponse<T>,
): T | null {
  const { data, error } = postgrestResponse;
  if (error) {
    toastError(error.code, error.details);
  }
  return data;
}

export function toastError(title: string, description: string) {
  if (title.length == 0 && description.length == 0) return;
  showToast({
    variant: "destructive",
    title,
    description,
  });
}
