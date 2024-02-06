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
import DashboardWrapper from "./routes/dashboard/wrapper.tsx";
import Dashboard from "./routes/dashboard/index.tsx";

render(() => {
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
							<Route path="/" component={Index} />
							<Route path="/teams" component={Teams} />
							<Route path="/team/:id" component={DashboardWrapper}>
								<Route path="/" component={Dashboard} />
							</Route>
						</Routes>
					</Router>
				</SupabaseProvider>
				<Toaster />
			</ColorModeProvider>
		</>
	);
}, document.getElementById("root") as HTMLElement);
