import { TimeUtils } from "@/core/temporal";
import { TimeContext } from "./context";

export function TimeProvider(props: {
  locale: number;
  children: React.ReactNode;
}) {
  const timeUtils = new TimeUtils({});

  return (
    <TimeContext.Provider value={timeUtils}>
      {props.children}
    </TimeContext.Provider>
  );
}
