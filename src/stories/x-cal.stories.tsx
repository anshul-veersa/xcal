import type { Meta, StoryObj } from "@storybook/react";

import { XCal } from "@/components/root/x-cal";

import { createDayData, createMonthData } from "./mock/events";
import { DayViewTile, MonthViewTile } from "./auxiliary-components";

const meta = {
  title: "XCal",
  component: XCal,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof XCal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayView: Story = {
  args: {
    view: "day",
    date: new Date(),
    backgroundEvents: [],
    events: createDayData(new Date(), 20),
    renderEventTile: DayViewTile as any,
    common: { maxViewHeight: 500 },
    onSlotClick: (slot) => {
      console.log("Slot Clicked", slot);
    },
  },
};

export const WeekView: Story = {
  args: {
    view: "week",
    date: new Date(),
    backgroundEvents: [],
    events: createMonthData(new Date(), 100),
    renderEventTile: DayViewTile as any,
    common: { maxViewHeight: 500 },
    onSlotClick: (slot) => {
      console.log("Slot Clicked", slot);
    },
  },
};

export const MonthView: Story = {
  args: {
    view: "month",
    date: new Date(),
    backgroundEvents: [],
    events: createMonthData(new Date(), 100),
    renderEventTile: MonthViewTile as any,
  },
};
