import { Accessor, Setter, createSignal } from "solid-js";

export type Comparator<T> = (a: T, b: T) => number;
export type FilterReturn<T> = {
  filter: (data: T[]) => T[];
  filterType: Accessor<keyof T>;
  setFilterType: Setter<keyof T>;
};

export function filter<T>(
  data: () => T[] | undefined | null,
  defaultValue: keyof T,
  filterFunctions: { [K in keyof T]?: (value: T[K]) => boolean },
): [() => T[], () => keyof T, Setter<keyof T>] {
  const [filterBy, setFilterBy] = createSignal<keyof T>(defaultValue);
  return [
    () => {
      const key = filterBy();
      const filterFunction = filterFunctions[key];
      return (
        data()?.filter((value) => {
          return filterFunction ? filterFunction(value[key]) : false;
        }) ?? []
      );
    },
    filterBy,
    setFilterBy,
  ];
}
