import type { CalendarData } from "@/types";
import { lazy } from "react";

type ViewProps<E = unknown, B = unknown> = {} & CalendarData<E, B>;

type ViewDef = {
  name: string;
  Component: React.LazyExoticComponent<React.ComponentType<ViewProps>>;
};

export const Views = {
  month: {
    name: "month",
    Component: lazy(() => import("./month/month")),
  },
  week: {
    name: "week",
    Component: lazy(() => import("./week/week")),
  },
  day: {
    name: "day",
    Component: lazy(() => import("./day/day")),
  },
  group: {
    name: "group",
    Component: lazy(() => import("./group/group")),
  },
} as const satisfies Record<string, ViewDef>;
