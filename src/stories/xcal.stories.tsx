import type { Meta, StoryObj } from "@storybook/react";

import { XCal } from "@/components/root/x-cal";
import { createDayData, createMonthData } from "./mock/events";
import { DayViewTile } from "./auxiliary-components";

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
    renderEventTile: DayViewTile,
    common: { maxViewHeight: 500 },
  },
};

export const WeekView: Story = {
  args: {
    view: "week",
    date: new Date(),
    backgroundEvents: [],
    events: createMonthData(new Date(), 100),
    renderEventTile: DayViewTile,
    common: { maxViewHeight: 500 },
  },
};

export const MonthView: Story = {
  args: {
    view: "month",
    date: new Date(),
    backgroundEvents: [],
    events: createMonthData(new Date(), 100),
    renderEventTile: DayViewTile,
    common: { maxViewHeight: 500 },
  },
};
