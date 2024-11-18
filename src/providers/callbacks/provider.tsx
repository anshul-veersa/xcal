import type { Callbacks } from "@/types";
import { CallbacksContext } from "./context";

export function CallbacksProvider(props: {
  callbacks: Partial<Callbacks<unknown>>;
  children: React.ReactNode;
}) {
  return (
    <CallbacksContext.Provider value={props.callbacks}>
      {props.children}
    </CallbacksContext.Provider>
  );
}
