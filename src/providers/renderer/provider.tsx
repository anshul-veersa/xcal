import { DataContext } from "./context";

export function RendererProvider(props: {
  config: number;
  children: React.ReactNode;
}) {
  return (
    <RendererContext.Provider value={timeUtils}>
      {props.children}
    </RendererContext.Provider>
  );
}
