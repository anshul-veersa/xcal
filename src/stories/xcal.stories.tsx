import type { Meta, StoryObj } from "@storybook/react";

import { XCal } from "@/components/root/x-cal";

const meta = {
  title: "XCal",
  component: XCal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof XCal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayView: Story = {
  args: {
    view: "day",
    date: new Date(),
    events: [
      {
        id: 1,
        startsAt: new Date("2024-11-17"),
        endsAt: new Date(),
        data: {},
      },
    ],
    renderEventTile: (k) =>
      k.view === "day" ? (
        <div>{k.tile.event.startsAt.toDateString()}</div>
      ) : null,
  },
};
