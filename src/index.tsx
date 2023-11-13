/* @refresh reload */
import {render} from "solid-js/web";

import "./styles.css";
import {Route, Router, Routes} from "@solidjs/router";
import TeamWrapper from "./component/TeamWrapper.tsx";
import Dashboard from "./page/Dashboard.tsx";
import { createClient } from "@supabase/supabase-js";
import {Database} from "../database.types.ts";

const supabase = createClient<Database>('https://jmdvrevzgaryrzhlzpgd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZHZyZXZ6Z2FyeXJ6aGx6cGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NDc0MjAsImV4cCI6MjAxNTIyMzQyMH0.tF2ZIvyGYwdrbdBhVvec3xk-QaVBY4GDVyDxN76X-k4')

export function getSupabaseClient() {
    return supabase;
}

render(
    () => (
        <Router>
            <Routes>
                <Route path={"/"} />
                <Route path={"/:team_id"} component={TeamWrapper}>
                    <Route path={"/"} component={Dashboard} />
                    <Route path={"/partners"} component={Dashboard} />
                    <Route path={"/roles"} component={Dashboard} />
                    <Route path={"/tags"} component={Dashboard} />
                    <Route path={"/users"} component={Dashboard} />
                    <Route path={"/settings"} component={Dashboard} />
                </Route>
            </Routes>
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
