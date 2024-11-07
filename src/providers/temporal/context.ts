import { createContext, useContext } from "react";
import { TimeUtils } from "../../../core/time";

export const TimeContext = createContext<TimeUtils | null>(null);

export function useTime() {
  const time = useContext(TimeContext);
  if (!time) throw new Error("Time context is not defined.");
  return time;
}
