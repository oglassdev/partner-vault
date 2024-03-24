import Help from "~/components/help.tsx";
import ColorModeToggle from "~/components/color-mode-toggle.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.tsx";
import AuthLoginForm from "~/components/auth-login-form.tsx";
import AuthSignUpForm from "~/components/auth-signup-form.tsx";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import { getUser } from "~/lib/database/supabase-user";

export default function Index() {
  const navigate = useNavigate();
  const [user] = createResource(getUser);
  createEffect(() => {
    const u = user();
    if (user.loading || u == null) return;
    navigate("/teams");
  });

  return (
    <main class="flex h-screen w-full flex-row">
      <div class="dark:bg-muted hidden flex-auto flex-col bg-gray-200 p-8 sm:flex dark:border-r">
        <h3 class="mt-4 text-xl font-semibold">Partner Vault</h3>
        <span class="my-auto" />
        <h4 class="text-md text-muted-foreground">
          FBLA 2023-2024
          <br />
          Coding and Programming
        </h4>
      </div>
      <div class="flex flex-1 flex-col p-4 transition-all sm:w-[400px] sm:flex-none lg:w-[430px]">
        <header class="line flex w-full items-center justify-end gap-1">
          <Help>
            Enter your email and password to log in. If you don't have an
            account, you can sign up with the button at the top right. OAuth is
            unsupported at the moment, but might be in the future.
          </Help>
          <ColorModeToggle />
        </header>
        <Tabs class="mb-0 mt-auto sm:mb-auto">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <Card class="mt-2">
            <TabsContent value="login">
              <CardHeader class="-mt-2">
                <CardTitle>Log in</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthLoginForm />
              </CardContent>
            </TabsContent>
            <TabsContent value="signup">
              <CardHeader class="-mt-2">
                <CardTitle>Create an account</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthSignUpForm />
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
        <footer></footer>
      </div>
    </main>
  );
}
