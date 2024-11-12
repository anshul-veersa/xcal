import { createContext, useContext } from "react";
import { TimeUtils } from "@/core/temporal";

export const TimeContext = createContext<TimeUtils | null>(null);

/** Use context aware (locale) time utilities */
export function useTime(): TimeUtils {
  const time = useContext(TimeContext);
  if (!time) throw new Error("Time context is not defined.");
  return time;
}
