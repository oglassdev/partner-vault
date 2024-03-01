import { useParams } from "@solidjs/router";
import { Contact, LineChart, Tag, User } from "lucide-solid";
import { For, createResource } from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import Help from "~/components/dialog/help";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Col, Grid } from "~/components/ui/grid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { handleError } from "~/lib/database/database";
import { getDate } from "~/lib/utils";

type Activity = {
  name: string;
  description: string;
  date: Date;
  href?: string;
};

export default function Dashboard() {
  const { team_id } = useParams();
  const supabase = useSupabaseContext();

  const [data] = createResource(async () => {
    return handleError(
      await supabase
        .from("teams")
        .select(
          `*,
          partners (
            *
          ),
          tags (
            *
          ),
          user_teams (
            *
          )`,
        )
        .eq("id", team_id)
        .limit(1)
        .single(),
    );
  });

  const activity = () => {
    let a: Activity[] = [];
    const d = data();
    d?.partners?.forEach((partner) => {
      a.push({
        name: "New Partner",
        description: partner.name,
        date: getDate(partner.created_at),
      });
    });
    d?.tags?.forEach((tag) => {
      a.push({
        name: "New Tag",
        description: tag.name,
        date: getDate(tag.created_at),
      });
    });
    return a
      .sort((a, b) => a.date.getMilliseconds() - b.date.getMilliseconds())
      .slice(-10);
  };

  return (
    <div class="h-full w-full overflow-auto">
      <DashboardTopBar>
        <Help>
          The dashboard shows necessary data at a glance. To navigate through
          Partner Vault, use the navigation menu at the left.
        </Help>
      </DashboardTopBar>
      <main class="flex h-full w-full flex-col">
        <SuspenseSpinner>
          <Grid cols={1} colsMd={2} colsLg={3} class="gap-2 p-2">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-md font-medium">Total Users</CardTitle>
                <User class="text-muted-foreground" size={20} />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  {data()?.user_teams.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-md font-medium">Total Tags</CardTitle>
                <Tag class="text-muted-foreground" size={20} />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{data()?.tags.length}</div>
              </CardContent>
            </Card>
            <Col span={1} spanMd={2} spanLg={1}>
              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-md font-medium">
                    Total Partners
                  </CardTitle>
                  <Contact class="text-muted-foreground" size={20} />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">
                    {data()?.partners.length}
                  </div>
                </CardContent>
              </Card>
            </Col>
            <Col span={1} spanMd={2} spanLg={3}>
              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-md font-medium">
                    Recent Activity
                  </CardTitle>
                  <LineChart class="text-muted-foreground" size={24} />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead class="w-[140px]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead class=" text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <For each={activity()}>
                        {(activity) => (
                          <TableRow>
                            <TableCell class="font-medium">
                              {activity.name}
                            </TableCell>
                            <TableCell>{activity.description}</TableCell>
                            <TableCell class="text-right">
                              {activity.date.toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        )}
                      </For>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Col>
          </Grid>
        </SuspenseSpinner>
      </main>
    </div>
  );
}
