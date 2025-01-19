import { lazy } from "react";
import type { CalendarData } from "@/types";

type ViewProps<E = unknown, B = unknown> = {} & CalendarData<E, B>;

type ViewDef = {
  name: string;
  Component: React.LazyExoticComponent<React.ComponentType<ViewProps>>;
};

export const Views = {
  month: {
    name: "month",
    Component: lazy(() => import("./month/month-view")),
  },
  week: {
    name: "week",
    Component: lazy(() => import("./week/week-view")),
  },
  day: {
    name: "day",
    Component: lazy(() => import("./day/day-view")),
  },
  group: {
    name: "group",
    Component: lazy(() => import("./group/group-view")),
  },
} as const satisfies Record<string, ViewDef>;
