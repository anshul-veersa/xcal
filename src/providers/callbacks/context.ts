import { createContext, useContext } from "react";
import type { Callbacks } from "@/types";

type CallbacksContextType = {} & Partial<Callbacks<unknown>>;

export const CallbacksContext = createContext<CallbacksContextType | null>(
  null
);

/** Use event callbacks */
export function useCallbacks() {
  const callbacks = useContext(CallbacksContext);

  if (!callbacks) throw new Error("Callbacks context is not defined.");

  return callbacks;
}
