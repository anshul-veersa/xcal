import { ConfigProvider } from "@/providers/config/provider";
import { TimeProvider } from "@/providers/temporal";
import type {
  RootConfig,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
  TileEvent,
} from "@/types";
import type { CalendarData } from "@/types/data";
import { Views } from "@/components/views";
import { RendererProvider } from "@/providers/renderer/provider";
import { DataProvider } from "@/providers/data/provider";

type XCalProps<E, B> = {
  renderEventTile: EventTileRenderFunction<TileEvent<E>>;
  renderHeaderItem?: HeaderItemRenderFunction;
  renderTimeSlot?: TimeSlotRenderFunction<B>;
  onEventUpdate?: () => void;
  onSlotClick?: () => void;
} & RootConfig &
  Omit<CalendarData<E, B>, "backgroundEvents"> &
  Partial<Pick<CalendarData<E, B>, "backgroundEvents">>;

export function XCal<EventData, BackgroundEventData>(
  props: XCalProps<EventData, BackgroundEventData>
) {
  const ActiveView = Views[props.view ?? "day"] ?? Views["day"];

  return (
    <ConfigProvider config={props}>
      <RendererProvider renderers={props}>
        <DataProvider
          data={{
            backgroundEvents: props.backgroundEvents ?? [],
            date: props.date,
            events: props.events,
            view: props.view,
          }}
        >
          <TimeProvider locale={props.locale}>
            <div className='xcal'>{<ActiveView.Component />}</div>
          </TimeProvider>
        </DataProvider>
      </RendererProvider>
    </ConfigProvider>
  );
}
