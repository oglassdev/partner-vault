import { SubmitHandler, createForm, setValue } from "@modular-forms/solid";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { TagUpdate as TagUpdateDb, handleError } from "~/lib/database/database";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Col, Grid } from "../ui/grid";
import { TagDropdownProps } from "./tag-dropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { As } from "@kobalte/core";
import { showToast } from "../ui/toast";
import { Textarea } from "../ui/textarea";
import { HexColorPicker } from "solid-colorful";
import { hexToNumber, numberToHex } from "~/lib/utils";

type TagUpdateFormType = Omit<TagUpdateDb, "id" | "team_id">;

export function TagUpdateForm(props: TagDropdownProps) {
  const [updateForm, { Field, Form }] = createForm<TagUpdateFormType>({
    initialValues: {
      name: props.tag.name,
      created_at: props.tag.created_at,
      color: props.tag.color,
      description: props.tag.description,
    },
  });
  const supabase = useSupabaseContext();

  const handleSubmit: SubmitHandler<TagUpdateFormType> = async (data) => {
    handleError(
      await supabase.from("tags").update(data).eq("id", props.tag.id),
    );
    props.refresh();
    showToast({
      title: "Updated tag",
    });
  };

  return (
    <Form onSubmit={handleSubmit} class="gap-2">
      <Grid cols={1} class="gap-2">
        <Col span={1} class="flex flex-col gap-1">
          <Field name="name">
            {(field, fieldProps) => (
              <>
                <Label for="name">Name</Label>
                {field.error && (
                  <p class="-mb-2 text-sm text-red-500">{field.error}</p>
                )}
                <Input
                  {...fieldProps}
                  id="name"
                  value={field.value}
                  placeholder={props.tag.name}
                />
              </>
            )}
          </Field>
          <Field name="description">
            {(field, fieldProps) => (
              <>
                <Label for="description">Description</Label>
                {field.error && (
                  <p class="-mb-2 text-sm text-red-500">{field.error}</p>
                )}
                <Textarea
                  {...fieldProps}
                  id="description"
                  class="h-full"
                  value={field.value ?? ""}
                  placeholder={props.tag.description ?? "Description"}
                />
              </>
            )}
          </Field>
        </Col>
        <Col span={1} spanMd={1} class="flex flex-col gap-1">
          <Field name="color" type="number">
            {(field, fieldProps) => {
              return (
                <>
                  <Label>Color</Label>
                  <HexColorPicker
                    color={numberToHex(field.value ?? 0)}
                    onChange={(color) => {
                      setValue(updateForm, "color", hexToNumber(color));
                    }}
                  />
                  <Input
                    placeholder="Color"
                    value={numberToHex(field.value ?? 0)}
                    {...fieldProps}
                    disabled
                  />
                </>
              );
            }}
          </Field>
        </Col>
        <Col span={1} spanMd={2}>
          <Button type="submit" class="w-full">
            Update
          </Button>
        </Col>
      </Grid>
    </Form>
  );
}

export default function TagUpdate(props: TagDropdownProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <As component={DropdownMenuItem} closeOnSelect={false}>
          <span class="sm w-full font-medium">Edit</span>
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[545px]">
        <DialogHeader>
          <DialogTitle class="flex flex-col">
            <span>Edit tag</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <TagUpdateForm {...props} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
