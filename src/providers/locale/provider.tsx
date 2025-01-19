import type { LocaleOptions } from "@/types";
import { LocaleContext } from "./context";

export function LocaleProvider(props: {
  locale: LocaleOptions;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={props.locale}>
      {props.children}
    </LocaleContext.Provider>
  );
}
