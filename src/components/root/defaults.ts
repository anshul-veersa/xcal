import type { LocaleOptions } from "@/types";
import { Views } from "../views";
import { userTimeZone } from "@/core/temporal";

const locale: LocaleOptions = {
  format: {
    date: {
      short: "P",
      abbr: "PP",
      long: "PPP",
      wide: "PPPP",
    },
    time: {
      short: "p",
      long: "pp",
    },
    dateTime: {
      short: "Pp",
      abbr: "PPp",
      long: "PPPpp",
      wide: "PPPPpp",
    },
    year: "yyyy",
    month: {
      short: "LLL",
      long: "LLLL",
    },
    weekDay: "EEE",
    day: "dd",
    weekNumber: "ww",
  },
  timeZone: userTimeZone,
  weekStartsOn: "monday",
  locale: new Intl.NumberFormat().resolvedOptions().locale,
};

export const defaults = {
  view: Views["day"],
  locale,
} as const;
