import type { LocaleOptions } from "@/types";
import { createContext, useContext } from "react";

export const LocaleContext = createContext<LocaleOptions | null>(null);

/** Use events and other data */
export function useLocale() {
  const data = useContext(LocaleContext);
  if (!data) throw new Error("Locale context is not defined.");
  return data;
}
