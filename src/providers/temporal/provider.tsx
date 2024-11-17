import { TimeUtils } from "@/core/temporal";
import { TimeContext } from "./context";
import type { LocaleOptions } from "@/types";

export function TimeProvider(props: {
  locale?: Partial<LocaleOptions>;
  children: React.ReactNode;
}) {
  const timeUtils = new TimeUtils({
    options: { weekStartsOn: props.locale?.weekStartsOn === "sunday" ? 0 : 1 },
  });

  return (
    <TimeContext.Provider value={timeUtils}>
      {props.children}
    </TimeContext.Provider>
  );
}
