/* @refresh reload */
import {render} from "solid-js/web";

import "./styles.css";
import {Route, Router, Routes} from "@solidjs/router";
import TeamWrapper from "./component/TeamWrapper.tsx";
import Dashboard from "./page/Dashboard.tsx";
import { createClient } from "@supabase/supabase-js";
import {Database} from "../database.types.ts";
import Login from "./page/Login.tsx";
import {Toaster} from "solid-toast";
import LoginWrapper from "./component/LoginWrapper.tsx";
import SignUp from "./page/SignUp.tsx";
import Teams from "./page/Teams.tsx";
import Partners from "./page/Partners.tsx";
import Reports from "./page/Reports.tsx";
import Tags from "./page/Tags.tsx";
import Users from "./page/Users.tsx";
import Settings from "./page/Settings.tsx";

const supabase = createClient<Database>('https://jmdvrevzgaryrzhlzpgd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZHZyZXZ6Z2FyeXJ6aGx6cGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NDc0MjAsImV4cCI6MjAxNTIyMzQyMH0.tF2ZIvyGYwdrbdBhVvec3xk-QaVBY4GDVyDxN76X-k4')

export function getSupabaseClient() {
    return supabase;
}

render(
    () => (
        <>
            <Router>
                <Routes>
                    <Route path={"/"} component={LoginWrapper}>
                        <Route path={"/"} component={Login} />
                        <Route path={"/signup"} component={SignUp} />
                    </Route>
                    <Route path={"/teams"} component={Teams} />
                    <Route path={"/teams/:teamId"} component={TeamWrapper}>
                        <Route path={"/"} component={Dashboard} />
                        <Route path={"/partners"} component={Partners} />
                        <Route path={"/reports"} component={Reports} />
                        <Route path={"/tags"} component={Tags} />
                        <Route path={"/users"} component={Users} />
                        <Route path={"/settings"} component={Settings} />
                    </Route>
                </Routes>
            </Router>
            <Toaster />
        </>
    ),
    document.getElementById("root") as HTMLElement
);
