/* @refresh reload */
import {render} from "solid-js/web";

import "./styles.css";
import {Route, Router, Routes} from "@solidjs/router";
import { createClient } from "@supabase/supabase-js";
import {Database} from "../database.types.ts";
import Login from "./routes/login.tsx";
import { Toaster } from "./components/ui/toast.tsx";

const SupabaseClient = createClient<Database>('https://jmdvrevzgaryrzhlzpgd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZHZyZXZ6Z2FyeXJ6aGx6cGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NDc0MjAsImV4cCI6MjAxNTIyMzQyMH0.tF2ZIvyGYwdrbdBhVvec3xk-QaVBY4GDVyDxN76X-k4')

render(
    () => (
        <>
            <Router>
                <Routes>
                    <Route path="/" component={Login} />
                </Routes>
            </Router>
            <Toaster />
        </>
    ),
    document.getElementById("root") as HTMLElement
);
