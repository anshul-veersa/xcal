import type { CalendarData } from "@/types";
import { createContext, useContext } from "react";

export const DataContext = createContext<CalendarData<unknown, unknown> | null>(
  null
);

/** Use events and other data */
export function useData() {
  const data = useContext(DataContext);
  if (!data) throw new Error("Data context is not defined.");
  return data;
}
