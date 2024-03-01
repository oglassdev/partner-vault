import { Outlet, useParams } from "@solidjs/router";
import { Contact, LayoutDashboard, Settings, Tags, Users } from "lucide-solid";
import DashboardNav from "~/components/dashboard-nav";

export default function DashboardWrapper() {
  const { team_id } = useParams();
  return (
    <div class="flex h-screen w-full flex-col-reverse sm:flex-row">
      <DashboardNav
        groups={[
          {
            name: undefined,
            links: [
              {
                name: "Dashboard",
                href: `/team/${team_id}`,
                show: true,
                icon: <LayoutDashboard class="flex-none" size={20} />,
              },
              {
                name: "Partners",
                href: `/team/${team_id}/partners`,
                show: true,
                icon: <Contact class="flex-none" size={20} />,
              },
              {
                name: "Tags",
                href: `/team/${team_id}/tags`,
                show: true,
                icon: <Tags class="flex-none" size={20} />,
              },
              {
                name: "Users",
                href: `/team/${team_id}/users`,
                show: true,
                icon: <Users class="flex-none" size={20} />,
              },
              {
                name: "Settings",
                href: `/team/${team_id}/settings`,
                show: true,
                icon: <Settings class="flex-none" size={20} />,
              },
            ],
          },
        ]}
      />
      <Outlet />
    </div>
  );
}
