import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { PartnerDropdownProps } from "./partner-dropdown";
import { PartnerUpdateForm } from "./partner-update";

export default function PartnerUpdateMobile(props: PartnerDropdownProps) {
  return (
    <Drawer>
      <DrawerTrigger as={Button} variant="secondary">
        Edit Partner
      </DrawerTrigger>
      <DrawerContent class="flex items-center gap-4 p-4 pt-0">
        <DrawerTitle class="mx-auto flex flex-col items-center justify-center gap-1 text-center">
          Edit Partner
        </DrawerTitle>
        <DrawerDescription class="flex max-w-[400px] flex-col items-center justify-center gap-1">
          <PartnerUpdateForm {...props} />
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
