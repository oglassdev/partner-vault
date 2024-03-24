import {
  SubmitHandler,
  createForm,
  insert,
  remove,
} from "@modular-forms/solid";
import { useSupabaseContext } from "~/lib/context/supabase-context";
import {
  PartnerUpdate as PartnerUpdateDb,
  TagRow,
  handleError,
} from "~/lib/database/database";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Col, Grid } from "../ui/grid";
import { PartnerDropdownProps } from "./partner-dropdown";
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxTrigger,
} from "../ui/combobox";
import { createResource, createSignal } from "solid-js";
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
import { Suspense } from "solid-js";
import { Badge } from "../ui/badge";
import { numberToHex } from "~/lib/utils";
import { For } from "solid-js";
import { Skeleton } from "../ui/skeleton";
import { showToast } from "../ui/toast";

type PartnerUpdateFormType = Omit<PartnerUpdateDb, "id" | "team_id">;

export function PartnerUpdateForm(props: PartnerDropdownProps) {
  const [updateForm, { Field, Form, FieldArray }] =
    createForm<PartnerUpdateFormType>({
      initialValues: {
        name: props.partner.name,
        type: props.partner.type,
        image: props.partner.image,
        contacts: props.partner.contacts,
        created_at: props.partner.created_at,
      },
    });
  const supabase = useSupabaseContext();

  const [tags] = createResource(
    async () =>
      handleError(
        await supabase
          .from("tags")
          .select("*")
          .eq("team_id", props.partner.team_id),
      ) ?? [],
    {
      initialValue: props.tags,
    },
  );
  const [tagsValues, setTagsValues] = createSignal<TagRow[]>(props.tags);

  const handleSubmit: SubmitHandler<PartnerUpdateFormType> = async (data) => {
    handleError(
      await supabase.rpc("update_partner_and_tags", {
        p_partner_id: props.partner.id,
        partner_details: data,
        tag_ids: tagsValues().map((tag) => tag.id),
      }),
    );
    props.refresh();
    showToast({
      title: "Updated partner",
    });
  };

  return (
    <Form onSubmit={handleSubmit} class="gap-2">
      <Grid cols={1} colsMd={2} class="gap-2">
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
                  placeholder={props.partner.name}
                />
              </>
            )}
          </Field>
          <Field name="type">
            {(field, fieldProps) => (
              <>
                <Label for="type">Type</Label>
                {field.error && (
                  <p class="-mb-2 text-sm text-red-500">{field.error}</p>
                )}
                <Input
                  {...fieldProps}
                  id="type"
                  value={field.value ?? ""}
                  placeholder={props.partner.type ?? "Type"}
                />
              </>
            )}
          </Field>
        </Col>
        <Col span={1} class="flex h-full flex-col gap-1">
          <Label>Tags</Label>
          <Suspense fallback={<Skeleton class="h-10 w-full" />}>
            <Combobox<TagRow>
              options={tags()}
              optionValue={"id"}
              optionLabel={"name"}
              value={tagsValues()}
              onChange={setTagsValues}
              multiple
              itemComponent={(props) => (
                <ComboboxItem item={props.item}>
                  <ComboboxItemLabel>
                    <Badge
                      variant="outline"
                      class="dark:border-opacity-50"
                      style={{
                        "border-color": numberToHex(
                          props.item.rawValue?.color ?? 0,
                        ),
                      }}
                    >
                      {props.item.rawValue.name}
                    </Badge>
                  </ComboboxItemLabel>
                  <ComboboxItemIndicator />
                </ComboboxItem>
              )}
              placeholder="Add tags..."
            >
              <ComboboxControl aria-label="Tags">
                <div class="flex w-full flex-wrap gap-1">
                  <For each={tagsValues()}>
                    {(tag) => (
                      <Badge
                        variant="outline"
                        class="hover:bg-muted mt-1 flex-none cursor-pointer dark:border-opacity-50"
                        style={{
                          "border-color": numberToHex(tag.color ?? 0),
                        }}
                        onClick={() =>
                          setTagsValues(
                            tagsValues().filter((tagValue) => tagValue != tag),
                          )
                        }
                      >
                        {tag.name}
                      </Badge>
                    )}
                  </For>
                  <ComboboxInput />
                </div>
                <ComboboxTrigger />
              </ComboboxControl>
              <ComboboxContent class="max-h-64 overflow-auto" />
            </Combobox>
          </Suspense>
        </Col>
        <Col span={1} spanMd={2} class="flex flex-col gap-1">
          <Label>Contacts</Label>
          <div class="flex max-h-64 flex-col gap-1 overflow-auto">
            <FieldArray name="contacts">
              {(fieldArray) => (
                <>
                  <For each={fieldArray.items}>
                    {(_, index) => (
                      <Field name={`contacts.${index()}`}>
                        {(field, props) => (
                          <div class="flex flex-row gap-1">
                            <Input
                              {...props}
                              type="text"
                              value={field.value}
                              class="flex-auto"
                            />
                            <Button
                              variant="destructive"
                              onClick={() => {
                                remove(updateForm, "contacts", { at: index() });
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </Field>
                    )}
                  </For>
                </>
              )}
            </FieldArray>
          </div>
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              insert(updateForm, "contacts", { value: "" });
            }}
          >
            Create Contact
          </Button>
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

export default function PartnerUpdate(props: PartnerDropdownProps) {
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
            <span>Edit partner</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <PartnerUpdateForm {...props} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
