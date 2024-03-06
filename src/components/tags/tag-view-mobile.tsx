import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { getDate } from "~/lib/utils";
import { TagDropdownProps } from "./tag-dropdown";
import { Label } from "../ui/label";

export default function PartnerViewMobile(props: TagDropdownProps) {
  return (
    <Drawer>
      <DrawerTrigger as={Button} variant="secondary">
        View Partner
      </DrawerTrigger>
      <DrawerContent class="flex items-center gap-4 p-4 pt-0">
        <DrawerTitle class="mx-auto flex flex-col items-center justify-center gap-1 text-center">
          <span class="mx-auto">{props.tag.name}</span>
        </DrawerTitle>
        <DrawerDescription class="flex max-w-[400px] flex-col items-center justify-center gap-1">
          <span>Created {getDate(props.tag.created_at).toLocaleString()}</span>
          <span class="text-muted-foreground text-md font-medium">
            {props.tag.id}
          </span>
          {props.tag.description?.length != null &&
            props.tag.description.length > 0 && (
              <>
                <Label>Description</Label>
                <p>{props.tag.description}</p>
              </>
            )}
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
