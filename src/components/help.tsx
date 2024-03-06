import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog.tsx";
import { As } from "@kobalte/core";
import { Button } from "~/components/ui/button.tsx";
import { BiRegularHelpCircle } from "solid-icons/bi";
import { ParentProps } from "solid-js";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export default function Help(props: ParentProps) {
  return (
    <>
      <Drawer>
        <DrawerTrigger
          as={Button}
          variant="ghost"
          size="sm"
          class="relative w-9 flex-none px-0 md:hidden"
        >
          <BiRegularHelpCircle class="rotate-0 scale-150 transition-all" />
          <span class="sr-only">Search</span>
        </DrawerTrigger>
        <DrawerContent class="gap-4 p-4 pt-0">
          <DrawerTitle class="mx-auto">Help</DrawerTitle>
          <DrawerDescription>{props.children}</DrawerDescription>
        </DrawerContent>
      </Drawer>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <As
            component={Button}
            variant="ghost"
            size="sm"
            class="hidden w-9 flex-none px-0 md:flex"
          >
            <BiRegularHelpCircle class="rotate-0 scale-150 transition-all" />
            <span class="sr-only">Help</span>
          </As>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Help</AlertDialogTitle>
          <AlertDialogDescription>{props.children}</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
