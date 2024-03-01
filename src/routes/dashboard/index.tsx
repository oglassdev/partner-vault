import { Contact, LineChart, Tag, User } from "lucide-solid";
import { For } from "solid-js";
import DashboardTopBar from "~/components/dashboard-top-bar";
import Help from "~/components/dialog/help";
import { SuspenseSpinner } from "~/components/suspense-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Col, Grid } from "~/components/ui/grid";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
const activities = [
  {
    name: "New Partner",
    description: "Weis Markets",
    date: "2/27/24",
  },
  {
    name: "New Partner",
    description: "FNCB Bank",
    date: "2/27/24",
  },
  {
    name: "New User",
    description: "Alex Marich",
    date: "2/27/24",
  },
  {
    name: "New Tag",
    description: "Store",
    date: "2/27/24",
  },
];
export default function Dashboard() {
  return (
    <div class="h-full w-full overflow-auto">
      <DashboardTopBar>
        <Help>
          The dashboard shows necessary data at a glance. To navigate through
          Partner Vault, use the navigation menu at the left.
        </Help>
      </DashboardTopBar>
      <main>
        <SuspenseSpinner>
          <Grid cols={1} colsMd={2} colsLg={3} class="gap-2 p-2">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-md font-medium">Total Users</CardTitle>
                <User class="text-muted-foreground" size={20} />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">50</div>
                <p class="text-muted-foreground text-xs">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-md font-medium">Total Tags</CardTitle>
                <Tag class="text-muted-foreground" size={20} />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">50</div>
                <p class="text-muted-foreground text-xs">
                  +20.1% from last month
                </p>
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
                  <div class="text-2xl font-bold">50</div>
                  <p class="text-muted-foreground text-xs">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
            </Col>
            <Col span={1} spanMd={2} spanLg={3}>
              <Card class="min-h-96">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-md font-medium">
                    Recent Activity
                  </CardTitle>
                  <LineChart class="text-muted-foreground" size={24} />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead class="w-[140px]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead class="w-[120px] text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <For each={activities}>
                        {(activity) => (
                          <TableRow>
                            <TableCell class="font-medium">
                              {activity.name}
                            </TableCell>
                            <TableCell>{activity.description}</TableCell>
                            <TableCell class="text-right">
                              {activity.date}
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
