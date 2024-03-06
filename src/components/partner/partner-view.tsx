import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { As } from "@kobalte/core";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { PartnerDropdownProps } from "./partner-dropdown";
import { For } from "solid-js";
import { Col, Grid } from "../ui/grid";
import { Show } from "solid-js";
import { getDate, numberToHex } from "~/lib/utils";
import { Badge } from "../ui/badge";

export default function PartnerView(props: PartnerDropdownProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <As component={DropdownMenuItem} closeOnSelect={false}>
          <span class="sm w-full font-medium">View</span>
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="flex flex-col">
            <span>{props.partner.name}</span>
            <span class="text-muted-foreground text-sm font-normal">
              {props.partner.id}
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Grid cols={2} class="gap-2">
            <Col span={2} class={"flex flex-col"}>
              <ul>
                <li class="text-md font-medium">
                  Created{" "}
                  <span class="text-primary">
                    {getDate(props.partner.created_at).toLocaleString()}
                  </span>
                </li>
              </ul>
            </Col>
            <Show when={props.tags.length > 0}>
              <Col>
                <span class="text-md font-medium">Tags</span>
                <ul>
                  <For each={props.tags}>
                    {(tag) => (
                      <li>
                        <Badge
                          variant="outline"
                          class="mt-1 dark:border-opacity-50"
                          style={{
                            "border-color": numberToHex(tag?.color ?? 0),
                          }}
                        >
                          {tag?.name}
                        </Badge>
                      </li>
                    )}
                  </For>
                </ul>
              </Col>
            </Show>
            <Show
              when={
                props.partner.contacts != null &&
                props.partner.contacts.length > 0
              }
            >
              <Col>
                <span class="text-md font-medium">Contacts</span>
                <ul>
                  <For each={props.partner.contacts}>
                    {(contact) => <li>{contact}</li>}
                  </For>
                </ul>
              </Col>
            </Show>
          </Grid>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
