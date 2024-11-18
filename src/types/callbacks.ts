import type { TimeSlot } from "@/components/abstract-views";
import type { TileEvent } from "./event";

type EventUpdateType = "time_update";

/**
 * Called when an event is update by the calendar sourcing from any user action or otherwise.
 */
export type EventUpdateCallback<EventData> = (
  eventType: EventUpdateType,
  updatedEvent: TileEvent<EventData>
) => boolean;

export type SlotClickCallback = (timeSlot: TimeSlot) => void;

export type Callbacks<EventData> = {
  onEventUpdate: EventUpdateCallback<EventData>;
  onSlotClick: SlotClickCallback;
};
