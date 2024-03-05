import { TagRow, handleError } from "~/lib/database/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { As } from "@kobalte/core";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import TagViewMobile from "./tag-view-mobile";
import TagView from "./tag-view";
import TagUpdate from "./tag-update";
import TagUpdateMobile from "./tag-update-mobile";
import { useSupabaseContext } from "~/lib/context/supabase-context";

export type TagDropdownProps = {
  tag: TagRow;
  refresh: () => void;
};

export default function TagDropdown(props: TagDropdownProps) {
  const supabase = useSupabaseContext();
  const deleteTag = async () => {
    handleError(await supabase.from("tags").delete().eq("id", props.tag.id));
    props.refresh();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <As
            component={Button}
            variant="ghost"
            size="sm"
            class="hidden h-9 w-9 flex-none sm:flex"
          >
            <MoreVertical size={24} class="rotate-0 transition-all" />
            <span class="sr-only">Options</span>
          </As>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <TagView {...props} />
          <TagUpdate {...props} />
          <Dialog>
            <DialogTrigger asChild>
              <As component={DropdownMenuItem} closeOnSelect={false}>
                <span class="w-full font-medium text-red-500">Delete</span>
              </As>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  Deleting{" "}
                  <span class="text-primary font-semibold">
                    {props.tag.name}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={deleteTag} variant="destructive">
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile UI */}
      <Drawer>
        <DrawerTrigger
          as={Button}
          variant="ghost"
          size="sm"
          class="h-9 w-9 flex-none sm:hidden"
        >
          <MoreVertical size={24} class="rotate-0 transition-all" />
          <span class="sr-only">Options</span>
        </DrawerTrigger>
        <DrawerContent class="gap-4 p-4 pt-0">
          <DrawerTitle class="mx-auto">{props.tag.name} Options</DrawerTitle>
          <DrawerDescription class="flex max-w-[400px] flex-col gap-1">
            <TagViewMobile {...props} />
            <TagUpdateMobile {...props} />
            <Button variant="destructive" onClick={deleteTag}>
              Delete
            </Button>
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
    </>
  );
}
