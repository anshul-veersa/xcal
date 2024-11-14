import { DataContext } from "./context";

export function DataProvider(props: {
  config: number;
  children: React.ReactNode;
}) {
  return (
    <DataContext.Provider value={timeUtils}>
      {props.children}
    </DataContext.Provider>
  );
}
