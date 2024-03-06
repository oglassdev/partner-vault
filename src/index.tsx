/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import { Route, Router, Routes } from "@solidjs/router";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types.ts";
import { Toaster } from "./components/ui/toast.tsx";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";
import Index from "~/routes";
import Teams from "~/routes/teams.tsx";
import { SupabaseProvider } from "./lib/context/supabase-context.ts";
import Dashboard from "./routes/dashboard/index.tsx";
import DashboardWrapper from "./routes/dashboard/wrapper.tsx";
import Users from "./routes/dashboard/users.tsx";
import Partners from "./routes/dashboard/partners.tsx";
import Tags from "./routes/dashboard/tags.tsx";
import Settings from "./routes/dashboard/settings.tsx";
import CreateProfile from "~/routes/create-profile.tsx";
import TransitionWrapper from "./components/transition-wrapper.tsx";

render(
  () => {
    const storageManager = createLocalStorageManager("color-mode");
    return (
      <>
        <ColorModeScript storageType={storageManager.type} />
        <ColorModeProvider storageManager={storageManager}>
          <SupabaseProvider
            value={createClient<Database>(
              "https://jmdvrevzgaryrzhlzpgd.supabase.co",
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZHZyZXZ6Z2FyeXJ6aGx6cGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NDc0MjAsImV4cCI6MjAxNTIyMzQyMH0.tF2ZIvyGYwdrbdBhVvec3xk-QaVBY4GDVyDxN76X-k4",
            )}
          >
            <Router>
              <Routes>
                <Route path="/" component={TransitionWrapper}>
                  <Route path="/" component={Index} />
                  <Route path="/createProfile" component={CreateProfile} />
                  <Route path="/teams" component={Teams} />
                </Route>
                <Route path="/team/:team_id/" component={DashboardWrapper}>
                  <Route path="/" component={Dashboard} />
                  <Route path="/users" component={Users} />
                  <Route path="/tags" component={Tags} />
                  <Route path="/partners" component={Partners} />
                  <Route path="/settings" component={Settings} />
                </Route>
              </Routes>
            </Router>
          </SupabaseProvider>
          <Toaster />
        </ColorModeProvider>
      </>
    );
  },
  document.getElementById("root") as HTMLElement,
);
