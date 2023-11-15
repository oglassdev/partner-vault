import {createForm, email, minLength, required, SubmitHandler} from "@modular-forms/solid";
import {getSupabaseClient} from "../index.tsx";
import Apple from "../assets/apple.svg";
import Google from "../assets/google.svg";
import {Check} from "lucide-solid";
import {toast} from "solid-toast";
import {A, useNavigate} from "@solidjs/router";
import Footer from "../component/Footer.tsx";
import {createEffect} from "solid-js";

type LoginFormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const [, {Form, Field}] = createForm<LoginFormValues>();
    let navigate = useNavigate();

    const handleSubmit: SubmitHandler<LoginFormValues> = async (values, _) => {
        let {data, error} = await getSupabaseClient().auth.signInWithPassword({
            email: values.email,
            password: values.password
        })
        if (error != null) {
            toast.error(error.message);
            return
        }
        if (data != null) {
            toast.success("Successfully logged in!");
            navigate("/teams");
            return
        }
        toast.error("An unexpected error occurred!");
    };
    createEffect(async () => {
        if ((await getSupabaseClient().auth.getSession())?.data?.session != null) {
            navigate("/teams")
            toast.success("Successfully logged in!")
        }
    })

    return (
        <div class={"flex h-screen w-full"}>
            <div class={"m-auto w-full sm:w-2/3 md:w-3/5 lg:w-1/2 p-8 h-auto pt-8"}>
                <div class={"font-semibold text-2xl text-center mb-2"}>Login to Partner Vault</div>
                <Form
                    onSubmit={handleSubmit}
                    class="space-y-2"
                >
                    <Field
                        name="email"
                        validate={[
                            required('Please enter your email.'),
                            email('The email address is incorrectly formatted.'),
                        ]}
                    >
                        {(field, props) => (
                            <div class={"w-full"}>
                                <input
                                    {...props}
                                    type="email"
                                    placeholder="Email"
                                    class="w-full px-4 py-2 border rounded-md"
                                />
                                {field.error && <div class={"text-red-700"}>{field.error}</div>}
                            </div>
                        )}
                    </Field>
                    <Field
                        name="password"
                        validate={[
                            required('Please enter your password.'),
                            minLength(8, 'You password must have 8 characters or more.'),
                        ]}
                    >
                        {(field, props) => (
                            <div class={"w-full"}>
                                <input
                                    {...props}
                                    type="password"
                                    placeholder="Password"
                                    class="w-full px-4 py-2 border rounded-md"
                                />
                                {field.error && <div class={"text-red-700"}>{field.error}</div>}
                            </div>
                        )}
                    </Field>
                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input type="checkbox" class="appearance-none relative peer w-6 h-6 border rounded-lg checked:bg-blue-500"/>
                            <Check class={"absolute hidden peer-checked:block text-white p-0.5"} />
                            <span class="ml-2 font-medium text-gray-600">Remember me</span>
                        </label>
                        <button
                            type="submit"
                            class="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </div>
                    <div class="flex items-center justify-center my-6 space-x-3">
                        <div class="border-t border-gray-300 flex-grow"></div>
                        <div class="text-gray-600">Or</div>
                        <div class="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div class="flex flex-col space-y-4">
                        <button
                            type="button"
                            onClick={() => { toast.error("OAuth is not yet implemented!", {id: "oauth"}) }}
                            class="hover:cursor-not-allowed py-2 px-4 bg-white text-gray-500 shadow-md rounded-md flex-row flex justify-center items-center font-medium space-x-2"
                        >
                            <Google class={"w-5 h-5"} />
                            <span>Sign in with Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { toast.error("OAuth is not yet implemented!", {id: "oauth"}) }}
                            class="hover:cursor-not-allowed py-2 px-4 bg-black text-white rounded-md flex-row flex justify-center items-center font-medium space-x-2">
                            <Apple class={"w-5 h-5 fill-white"} />
                            <span>Sign in with Apple</span>
                        </button>
                    </div>
                    <div class={"text-center"}><span class={"text-gray-500"}>Don't have an account?</span> <A href={"/signup"}><span class={"text-blue-500 underline"}>Sign up</span></A></div>
                </Form>
            </div>
            <Footer showLeave={false} />
        </div>
    );
};