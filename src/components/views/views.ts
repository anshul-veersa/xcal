import { defineAsyncComponent } from "vue";

export const Views = {
  month: {
    name: "month",
    component: defineAsyncComponent(() => import("./month/month.vue")),
  },
  week: {
    name: "week",
    component: defineAsyncComponent(() => import("./week/week.vue")),
  },
  day: {
    name: "day",
    component: defineAsyncComponent(() => import("./day/day.vue")),
  },
  group: {
    name: "group",
    component: defineAsyncComponent(() => import("./group/group.vue")),
  },
} as const;
