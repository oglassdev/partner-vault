import Help from "~/components/dialog/help.tsx";
import ColorModeToggle from "~/components/color-mode-toggle.tsx";
import {Transition} from "solid-transition-group";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/components/ui/tabs.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card.tsx";
import AuthLoginForm from "~/components/auth-login-form.tsx";
import AuthSignUpForm from "~/components/auth-signup-form.tsx";

export default function Index() {
    return (
        <main class="flex w-full h-screen flex-row">
            <div class="flex-auto p-8 bg-gray-200 dark:bg-muted dark:border-r hidden sm:flex flex-col">
                <h3 class="mt-4 font-semibold text-xl">Partner Vault</h3>
                <span class="my-auto"/>
                <h4 class="text-md text-muted-foreground">FBLA 2023-2024<br/>Coding and Programming</h4>
            </div>
            <div class="flex-1 sm:flex-none sm:w-[400px] lg:w-[430px] p-4 flex transition-all flex-col">
                <header class="w-full flex line items-center justify-end gap-1">
                    <Help>
                        Enter your email and password to log in.
                        If you don't have an account, you can sign up with the button at the top right.
                        OAuth is unsupported at the moment, but might be in the future.
                    </Help>
                    <ColorModeToggle/>
                </header>
                <Tabs class="mt-auto mb-0 sm:mb-auto">
                    <TabsList class="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                    </TabsList>
                    <Card class="mt-2">
                        <Transition
                            onEnter={(el, done) => {
                                el.animate([
                                    {
                                        transform: "translate(4%, 0%)",
                                        opacity: 0
                                    },
                                    {
                                        transform: "translate(0%, 0%)",
                                        opacity: 100
                                    }
                                ], {
                                    duration: 150,
                                    easing: "ease-out"
                                }).finished.then(done)
                            }}
                            onExit={(el, done) => {
                                el.animate([
                                    {
                                        transform: "translate(0%, 0%)",
                                        opacity: 100
                                    },
                                    {
                                        transform: "translate(-4%, 0%)",
                                        opacity: 0
                                    }
                                ], {
                                    duration: 150,
                                    easing: "ease-in"
                                }).finished.then(done)
                            }}
                            mode="outin"
                        >
                            <TabsContent value="login">
                                <CardHeader class="-mt-2">
                                    <CardTitle>Log in</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AuthLoginForm/>
                                </CardContent>
                            </TabsContent>
                            <TabsContent value="signup">
                                <CardHeader class="-mt-2">
                                    <CardTitle>Create an account</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AuthSignUpForm/>
                                </CardContent>
                            </TabsContent>
                        </Transition>
                    </Card>
                </Tabs>
                <footer>
                </footer>
            </div>
        </main>
    )
}