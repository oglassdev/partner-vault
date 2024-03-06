import { createForm, SubmitHandler, valiForm } from "@modular-forms/solid";
import { ProfileForm, ProfileSchema } from "~/lib/validations/profile.ts";
import { showToast } from "~/components/ui/toast.tsx";
import { Input } from "~/components/ui/input.tsx";
import { Button } from "~/components/ui/button.tsx";
import { TbLoader } from "solid-icons/tb";
import { useSupabaseContext } from "~/lib/context/supabase-context.ts";

export default function ProfileCreationForm(props: { onComplete: () => void }) {
  const [profileForm, { Form, Field }] = createForm<ProfileForm>({
    validate: valiForm(ProfileSchema),
  });
  const supabase = useSupabaseContext();
  const handleSubmit: SubmitHandler<ProfileForm> = async (values) => {
    let {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      showToast({
        title: `Error: ${sessionError.name}`,
        description: sessionError.message,
      });
      return;
    }
    if (session == null) {
      showToast({
        title: `Invalid Session`,
        description: "Log back in to continue.",
      });
      return;
    }
    let { error } = await supabase.from("profiles").insert({
      id: session.user.id,
      public_email:
        values.public_email.length == 0 ? null : values.public_email,
      username: values.username,
    });
    if (error) {
      showToast({
        title: `Error: ${error.code}`,
        description: error.message,
      });
      return;
    }
    props.onComplete();
  };

  return (
    <Form onSubmit={handleSubmit} class="my-auto flex flex-col gap-3">
      <Field name="username">
        {(field, props) => (
          <>
            {field.error.length > 0 && (
              <p class="-mb-2 text-sm text-red-500">{field.error}</p>
            )}
            <Input {...props} placeholder="Username" />
          </>
        )}
      </Field>
      <Field name="public_email">
        {(_, props) => (
          <Input
            {...props}
            type="email"
            placeholder="Leave blank to make your email private"
          />
        )}
      </Field>
      <Button type="submit" disabled={profileForm.submitting}>
        {profileForm.submitting && (
          <TbLoader class="mr-2 h-4 w-4 animate-spin" />
        )}
        Update Profile
      </Button>
    </Form>
  );
}
