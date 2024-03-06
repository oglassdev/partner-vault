import { useNavigate } from "@solidjs/router";
import ProfileCreationForm from "~/components/profile-creation-form";
import { SuspenseSpinner } from "~/components/suspense-spinner";

export default function CreateProfile() {
  const navigate = useNavigate();

  return (
    <main class="flex h-screen w-full flex-row">
      <SuspenseSpinner>
        <div class="m-auto flex w-[425px] flex-col">
          <h1 class="mb-4 w-full text-center text-lg font-medium">
            Let's start by creating a profile.
          </h1>
          <ProfileCreationForm onComplete={() => navigate("/teams")} />
        </div>
      </SuspenseSpinner>
    </main>
  );
}
