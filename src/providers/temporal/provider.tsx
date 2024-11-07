import { TimeUtils } from "../../../core/time";
import { TimeContext } from "./context";

export function TimeProvider(props: { locale: number }) {
  const timeUtils = new TimeUtils({});

  return <TimeContext.Provider value={timeUtils}></TimeContext.Provider>;
}
