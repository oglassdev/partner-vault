import {createContext, useContext} from "solid-js";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "../../../database.types.ts";

const SupabaseContext = createContext<SupabaseClient<Database>>()
export const SupabaseProvider = SupabaseContext.Provider
export function useSupabaseContext() {
    const value = useContext(SupabaseContext);
    if (value == undefined) {
        throw new Error("useSupabaseContext must be used within a SupabaseContext.Provider");
    }
    return value
}