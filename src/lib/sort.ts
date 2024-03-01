import { Setter, createSignal } from "solid-js";

export type Comparator<T> = (a: T, b: T) => number;

export function sort<T>(
  data: () => T[] | undefined | null,
  defaultValue: keyof T,
  compareFunctions: { [K in keyof T]?: Comparator<T[K]> },
): [() => T[], () => keyof T, Setter<keyof T>] {
  const [sortBy, setSortBy] = createSignal<keyof T>(defaultValue);
  return [
    () => {
      const key = sortBy();
      const compareFunction = compareFunctions[key];
      return (
        data()?.sort((a, b) => {
          return compareFunction ? compareFunction(a[key], b[key]) : 0;
        }) ?? []
      );
    },
    sortBy,
    setSortBy,
  ];
}
