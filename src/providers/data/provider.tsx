import type { CalendarData } from "@/types/data";
import { DataContext } from "./context";

export function DataProvider(props: {
  data: CalendarData<unknown, unknown>;
  children: React.ReactNode;
}) {
  return (
    <DataContext.Provider value={props.data}>
      {props.children}
    </DataContext.Provider>
  );
}
