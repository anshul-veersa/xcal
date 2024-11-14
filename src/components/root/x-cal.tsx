import { ConfigProvider } from "@/providers/config/provider";
import { TimeProvider } from "@/providers/temporal";
import type {
  RootConfig,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
  CalendarEvent,
} from "@/types";
import type { CalendarData } from "@/types/data";
import { Views } from "@/components/views";

type XCalProps<E, B> = {
  renderEventTile: EventTileRenderFunction<CalendarEvent<E>>;
  renderHeaderItem?: HeaderItemRenderFunction;
  renderTimeSlot?: TimeSlotRenderFunction;
  onEventUpdate?: () => void;
  onSlotClick?: () => void;
} & RootConfig<E, B> &
  Omit<CalendarData<E, B>, "backgroundEvents"> &
  Partial<Pick<CalendarData<E, B>, "backgroundEvents">>;

export function XCal<EventData, BackgroundEventData>(
  props: XCalProps<EventData, BackgroundEventData>
) {
  const ActiveView = Views[props.view ?? "day"] ?? Views["day"];

  return (
    <ConfigProvider config={1}>
      <TimeProvider locale={props.locale}>
        <div className='xcal'>{<ActiveView.Component />}</div>
      </TimeProvider>
    </ConfigProvider>
  );
}
