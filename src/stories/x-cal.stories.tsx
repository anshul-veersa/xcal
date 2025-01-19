import type { Meta, StoryObj } from "@storybook/react";

import { XCal } from "../components/root/x-cal";

import { createDayData, createMonthData } from "./mock/events";
import { DayViewTile, MonthViewTile } from "./auxiliary-components";

const meta = {
  title: "XCal",
  component: XCal,
} satisfies Meta<typeof XCal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayView: Story = {
  args: {
    view: "day",
    date: new Date(),
    backgroundEvents: [],
    events: createDayData(new Date(), 10),
    style: { "--max-view-height": "620px" },
    renderEventTile: DayViewTile,
  },
};

export const WeekView: Story = {
  args: {
    view: "week",
    date: new Date(),
    backgroundEvents: [],
    events: createMonthData(new Date(), 10),
    renderEventTile: DayViewTile,
    style: { "--max-view-height": "620px" },
    config: {
      showSlotIndicators: true,
      showSlotSeparator: true,
      useTimeZonedEvents: true,
    },
  },
};

export const MonthView: Story = {
  args: {
    view: "month",
    date: new Date(),
    backgroundEvents: [],
    style: { "--max-view-height": "620px" },
    events: createMonthData(new Date(), 100),
    renderEventTile: MonthViewTile,
  },
};

export const GroupView: Story = {
  args: {
    view: "group",
    date: new Date(),
    backgroundEvents: [],
    style: { "--max-view-height": "620px" },
    events: createMonthData(new Date(), 200),
    renderEventTile: DayViewTile,
    views: {
      group: {
        groupSelector: (event) => {
          return event.data.title;
        },
      },
    },
    config: {
      useTimeZonedEvents: true,
      showSlotSeparator: false,
      slotDuration: 20,
    },
  },
};
