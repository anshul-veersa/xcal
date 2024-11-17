import { ConfigProvider } from "@/providers/config/provider";
import { TimeProvider } from "@/providers/temporal";
import type {
  RootConfig,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
  TileEvent,
  CalendarData,
} from "@/types";
import { Views } from "@/components/views";
import { RendererProvider } from "@/providers/renderer/provider";
import { DataProvider } from "@/providers/data/provider";

import s from "./styles.module.scss";

const defaults = {
  view: Views["day"],
} as const;

type XCalProps<EventData, BackgroundEventData> = {
  renderEventTile: EventTileRenderFunction<TileEvent<EventData>>;
  renderHeaderItem?: HeaderItemRenderFunction;
  renderTimeSlot?: TimeSlotRenderFunction<BackgroundEventData>;
  onEventUpdate?: () => void;
  onSlotClick?: () => void;
} & RootConfig &
  Omit<CalendarData<EventData, BackgroundEventData>, "backgroundEvents"> &
  Partial<
    Pick<CalendarData<EventData, BackgroundEventData>, "backgroundEvents">
  >;

export function XCal<EventData, BackgroundEventData>(
  props: XCalProps<EventData, BackgroundEventData>
) {
  const ActiveView = Views[props.view] ?? defaults.view;

  return (
    <ConfigProvider config={props}>
      <RendererProvider
        renderers={{
          renderEventTile:
            props.renderEventTile as EventTileRenderFunction<TileEvent>,
          renderHeaderItem: props.renderHeaderItem,
          renderTimeSlot: props.renderTimeSlot as TimeSlotRenderFunction,
        }}
      >
        <DataProvider
          data={{
            backgroundEvents: props.backgroundEvents ?? [],
            date: props.date,
            events: props.events,
            view: props.view,
          }}
        >
          <TimeProvider locale={props.locale}>
            <div className={s["x-cal"]}>{<ActiveView.Component />}</div>
          </TimeProvider>
        </DataProvider>
      </RendererProvider>
    </ConfigProvider>
  );
}
