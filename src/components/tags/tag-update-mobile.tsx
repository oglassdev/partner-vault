import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { TagDropdownProps } from "./tag-dropdown";
import { TagUpdateForm } from "./tag-update";

export default function TagUpdateMobile(props: TagDropdownProps) {
  return (
    <Drawer>
      <DrawerTrigger as={Button} variant="secondary">
        Edit Tag
      </DrawerTrigger>
      <DrawerContent class="flex items-center gap-4 p-4 pt-0">
        <DrawerTitle class="mx-auto flex flex-col items-center justify-center gap-1 text-center">
          Edit Tag
        </DrawerTitle>
        <DrawerDescription class="flex max-w-[400px] flex-col items-center justify-center gap-1">
          <TagUpdateForm {...props} />
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
