import {createForm, email, minLength, required, SubmitHandler} from "@modular-forms/solid";
import {getSupabaseClient} from "../index.tsx";
import Apple from "../assets/apple.svg";
import Google from "../assets/google.svg";
import {toast} from "solid-toast";
import {A, useNavigate} from "@solidjs/router";
import {createEffect} from "solid-js";

type LoginFormValues = {
    email: string;
    password: string;
};

export default function SignUp() {
    const [, {Form, Field}] = createForm<LoginFormValues>();
    let navigate = useNavigate();

    createEffect(async () => {
        if ((await getSupabaseClient().auth.getSession())?.data?.session != null) {
            navigate("/teams")
            toast.success("Successfully logged in!")
        }
    })

    const handleSubmit: SubmitHandler<LoginFormValues> = async (values, _) => {
        let loadingId = toast.loading("Signing up...");
        let {data, error} = await getSupabaseClient().auth.signUp({
            email: values.email,
            password: values.password
        })
        toast.remove(loadingId);
        if (error != null) {
            toast.error(error.message);
            return
        }
        if (data != null) {
            toast.success("Next step - Verify your email!")
            navigate("/");
            return
        }
        toast.error("An unexpected error occurred!")
    };

    return (
        <div class={"flex h-screen w-full dark:bg-gray-800"}>
            <div class={"m-auto w-full sm:w-2/3 md:w-3/5 lg:w-1/2 p-8 h-auto pt-8"}>
                <div class={"font-semibold text-2xl text-center mb-2 dark:text-white"}>Create an Account</div>
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
                        <button
                            type="submit"
                            class="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Sign up
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
                            <span>Sign up with Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { toast.error("OAuth is not yet implemented!", {id: "oauth"}) }}
                            class="hover:cursor-not-allowed py-2 px-4 bg-black text-white rounded-md flex-row flex justify-center items-center font-medium space-x-2">
                            <Apple class={"w-5 h-5 fill-white"} />
                            <span>Sign up with Apple</span>
                        </button>
                    </div>
                    <div class={"text-center"}><span class={"text-gray-500 dark:text-gray-400"}>Already have an account?</span> <A href={"/"}><span class={"text-blue-500 underline"}>Sign in</span></A></div>
                </Form>
            </div>
        </div>
    );
};
