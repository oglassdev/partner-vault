import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { For } from "solid-js";
import { getDate, numberToHex } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { PartnerDropdownProps } from "./partner-dropdown";

export default function PartnerViewMobile(props: PartnerDropdownProps) {
  return (
    <Drawer>
      <DrawerTrigger as={Button} variant="secondary">
        View Partner
      </DrawerTrigger>
      <DrawerContent class="flex items-center gap-4 p-4 pt-0">
        <DrawerTitle class="mx-auto flex flex-col items-center justify-center gap-1 text-center">
          <span class="mx-auto">
            {props.partner.name}
            {props.partner.type && (
              <span class="text-muted-foreground text-lg font-medium">
                {" "}
                - {props.partner.type}
              </span>
            )}
          </span>
          <div class="flex flex-wrap items-center justify-center gap-1 text-center">
            <For each={props.tags}>
              {(tag) => (
                <Badge
                  variant="outline"
                  class="dark:border-opacity-50"
                  style={{
                    "border-color": numberToHex(tag?.color ?? 0),
                  }}
                >
                  {tag?.name}
                </Badge>
              )}
            </For>
          </div>
        </DrawerTitle>
        <DrawerDescription class="flex max-w-[400px] flex-col items-center justify-center gap-1">
          <div class="text-md flex flex-col items-center justify-center font-medium">
            {(props.partner.contacts?.length ?? 0) > 0 && (
              <span class="font-md text-primary text-lg">Contacts</span>
            )}
            <For each={props.partner.contacts}>
              {(contact) => (
                <span class="text-muted-foreground">{contact}</span>
              )}
            </For>
          </div>
          <span>
            Created {getDate(props.partner.created_at).toLocaleString()}
          </span>
          <span class="text-muted-foreground text-md font-medium">
            {props.partner.id}
          </span>
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
