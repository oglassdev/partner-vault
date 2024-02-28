import { Outlet, useParams } from "@solidjs/router";
import { Contact, LayoutDashboard, Settings, Users } from "lucide-solid";
import DashboardNav from "~/components/dashboard-nav";

export default function DashboardWrapper() {
  const { team_id } = useParams();
  return (
    <div class="flex h-screen w-full flex-row">
      <DashboardNav
        groups={[
          {
            name: undefined,
            links: [
              {
                name: "Dashboard",
                href: `/team/${team_id}`,
                show: true,
                icon: <LayoutDashboard size={20} />,
              },
              {
                name: "Partners",
                href: `/team/${team_id}/partners`,
                show: true,
                icon: <Contact size={20} />,
              },
              {
                name: "Users",
                href: `/team/${team_id}/users`,
                show: true,
                icon: <Users size={20} />,
              },
              {
                name: "Settings",
                href: `/team/${team_id}/settings`,
                show: true,
                icon: <Settings size={20} />,
              },
            ],
          },
        ]}
      />
      <Outlet />
    </div>
  );
}
