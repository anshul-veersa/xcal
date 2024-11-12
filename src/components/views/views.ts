import { lazy } from "react";

export const Views = {
  month: {
    name: "month",
    component: lazy(() => import("./month/month")),
  },
  week: {
    name: "week",
    component: lazy(() => import("./week/week")),
  },
  day: {
    name: "day",
    component: lazy(() => import("./day/day")),
  },
  group: {
    name: "group",
    component: lazy(() => import("./group/group")),
  },
} as const;
