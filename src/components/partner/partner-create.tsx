import {
  SubmitHandler,
  createForm,
  insert,
  remove,
} from "@modular-forms/solid";
import { PartnerInsert, TagRow, handleError } from "~/lib/database/database";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { For, Setter, createResource, createSignal } from "solid-js";
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
import { Suspense } from "solid-js";
import { Skeleton } from "../ui/skeleton";
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
import { Badge } from "../ui/badge";
import { numberToHex } from "~/lib/utils";

export type PartnerCreateFormType = Omit<
  PartnerInsert,
  "id" | "created_at" | "team_id"
>;

export type PartnerCreateProps = {
  team_id: string;
  refresh: () => void;
};

export function PartnerCreateForm(
  props: PartnerCreateProps & { onOpenChange: Setter<boolean> },
) {
  const supabase = useSupabaseContext();

  const [form, { Form, Field, FieldArray }] = createForm<PartnerCreateFormType>(
    {
      initialValues: {
        name: "",
      },
    },
  );

  const [tags] = createResource(
    async () =>
      handleError(
        await supabase.from("tags").select("*").eq("team_id", props.team_id),
      ) ?? [],
    {
      initialValue: [],
    },
  );
  const [tagsValues, setTagsValues] = createSignal<TagRow[]>([]);

  const handleSubmit: SubmitHandler<PartnerCreateFormType> = async (data) => {
    const partner = handleError(
      await supabase
        .from("partners")
        .insert({ ...data, team_id: props.team_id })
        .select()
        .limit(1)
        .maybeSingle(),
    );
    if (partner == null) {
      showToast({
        title: "Failed to create partner",
        variant: "destructive",
      });
      return;
    }
    const tags = tagsValues().map((tag) => ({
      tag_id: tag.id,
      partner_id: partner.id,
    }));
    handleError(await supabase.from("partner_tags").insert(tags));
    props.onOpenChange(false);
    props.refresh();
    showToast({
      title: "Created " + data.name,
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
                  placeholder={"Name"}
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
                  placeholder={"Type"}
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
                                remove(form, "contacts", { at: index() });
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
              insert(form, "contacts", { value: "" });
            }}
          >
            Create Contact
          </Button>
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

export default function PartnerCreate(props: PartnerCreateProps) {
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
          <span class="sr-only">Help</span>
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[545px]">
        <DialogHeader>
          <DialogTitle class="flex flex-col">
            <span>Create partner</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <PartnerCreateForm {...props} onOpenChange={setOpen} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
