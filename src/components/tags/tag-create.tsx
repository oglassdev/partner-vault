import { SubmitHandler, createForm, setValue } from "@modular-forms/solid";
import { TagInsert, handleError } from "~/lib/database/database";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Setter, createSignal } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { As } from "@kobalte/core";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import { Plus } from "lucide-solid";
import { showToast } from "../ui/toast";
import { Col, Grid } from "../ui/grid";
import { HexColorPicker } from "solid-colorful";
import { hexToNumber, numberToHex } from "~/lib/utils";
import { Textarea } from "../ui/textarea";

export type TagCreateFormType = Omit<
  TagInsert,
  "id" | "created_at" | "team_id"
>;

export type TagCreateProps = {
  team_id: string;
  refresh: () => void;
};

export function PartnerCreateForm(
  props: TagCreateProps & { onOpenChange: Setter<boolean> },
) {
  const [form, { Field, Form }] = createForm<TagCreateFormType>({
    initialValues: {
      name: "",
      color: 0,
      description: "",
    },
  });
  const supabase = useSupabaseContext();

  const handleSubmit: SubmitHandler<TagCreateFormType> = async (data) => {
    handleError(
      await supabase.from("tags").insert({ ...data, team_id: props.team_id }),
    );
    props.onOpenChange(false);
    props.refresh();
    showToast({
      title: "Created tag " + data.name,
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
                  placeholder={"Name"}
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
                  placeholder={"Description"}
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
                      setValue(form, "color", hexToNumber(color));
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
            Create
          </Button>
        </Col>
      </Grid>
    </Form>
  );
}

export default function TagCreate(props: TagCreateProps) {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As
          component={Button}
          variant="ghost"
          size="sm"
          class="hidden w-9 flex-none px-0 md:flex"
        >
          <Plus size={20} />
          <span class="sr-only">Create</span>
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[545px]">
        <DialogHeader>
          <DialogTitle class="flex flex-col">
            <span>Create Tag</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <PartnerCreateForm {...props} onOpenChange={setOpen} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
