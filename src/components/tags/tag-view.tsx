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
import { TagDropdownProps } from "./tag-dropdown";
import { Col, Grid } from "../ui/grid";
import { Show } from "solid-js";
import { getDate } from "~/lib/utils";

export default function TagView(props: TagDropdownProps) {
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
            <span>{props.tag.name}</span>
            <span class="text-muted-foreground text-sm font-normal">
              {props.tag.id}
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
                    {getDate(props.tag.created_at).toLocaleString()}
                  </span>
                </li>
              </ul>
            </Col>
            <Show when={props.tag.description?.length != 0}>
              <Col span={2} class={"flex flex-col"}>
                <span class="text-md font-medium">Description</span>
                <span class="text-primary">{props.tag.description}</span>
              </Col>
            </Show>
          </Grid>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
