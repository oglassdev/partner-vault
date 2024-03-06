import { Button } from "~/components/ui/button";
import { Search as SearchIcon } from "lucide-solid";
import { Setter } from "solid-js";
import { Input } from "./ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export default function Search(props: {
  value: string;
  setValue: Setter<string>;
}) {
  const setValue = (e: any) => {
    props.setValue(e.currentTarget.value);
  };
  return (
    <>
      <Drawer>
        <DrawerTrigger
          as={Button}
          variant="ghost"
          size="sm"
          class="relative w-9 flex-none px-0 md:hidden"
        >
          <SearchIcon size={20} class="rotate-0 transition-all" />
          <span class="sr-only">Search</span>
        </DrawerTrigger>
        <DrawerContent class="gap-4 p-4 pt-0">
          <DrawerTitle class="mx-auto">Search</DrawerTitle>
          <DrawerDescription>
            <Input
              class="mx-auto max-w-96"
              placeholder="Search"
              value={props.value}
              onInput={setValue}
            />
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
      <Input
        class="hidden h-9 md:block"
        placeholder="Search"
        value={props.value}
        onInput={setValue}
      />
    </>
  );
}
