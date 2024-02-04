import {Input} from "~/components/ui/input.tsx";
import {Button} from "~/components/ui/button.tsx";
import {createForm, SubmitHandler, valiForm} from "@modular-forms/solid";
import {AuthForm, AuthSchema} from "~/lib/validations/auth.ts";
import {TbLoader} from "solid-icons/tb";
import {showToast} from "~/components/ui/toast.tsx";
import {useSupabaseContext} from "~/index.tsx";

export default function AuthSignUpForm() {
    const [authForm, { Form, Field }] = createForm<AuthForm>({
        validate: valiForm(AuthSchema)
    })
    const supabase = useSupabaseContext()
    const handleSubmit: SubmitHandler<AuthForm> = async (values) => {
        let { error }  = await supabase.auth.signUp({
            email: values.email,
            password: values.password
        });
        if (error) {
            showToast({
                title: `Error: ${error.name}`,
                description: error.message
            })
        }
    }
    return <Form onSubmit={handleSubmit} class="gap-3 flex flex-col my-auto">
        <Field name="email">
            {(_, props) => (
                <Input {...props} type="email" placeholder="me@email.com" />
            )}
        </Field>
        <Field name="password">
            {(_, props) => (
                <Input {...props} type="password" placeholder="Password"/>
            )}
        </Field>
        <Button type="submit" disabled={authForm.submitting}>
            {authForm.submitting && <TbLoader class="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
        </Button>
    </Form>
}