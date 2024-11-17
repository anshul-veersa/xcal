import { ConfigProvider } from "@/providers/config/provider";
import { TimeProvider } from "@/providers/temporal";
import type {
  RootConfig,
  EventTileRenderFunction,
  TimeSlotRenderFunction,
  TileEvent,
  CalendarData,
  RenderFunctions,
} from "@/types";
import { Views } from "@/components/views";
import { RendererProvider } from "@/providers/renderer/provider";
import { DataProvider } from "@/providers/data/provider";

import s from "./styles.module.scss";

const defaults = {
  view: Views["day"],
} as const;

type XCalProps<EventData, BackgroundEventData> = {
  onEventUpdate?: () => void;
  onSlotClick?: () => void;
} & RenderFunctions<EventData, BackgroundEventData> &
  RootConfig &
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
          renderTimeGridCorner: props.renderTimeGridCorner,
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
            <div
              className={s["x-cal"]}
              style={
                {
                  "--max-view-height": props.common?.maxViewHeight,
                } as React.CSSProperties
              }
            >
              {<ActiveView.Component />}
            </div>
          </TimeProvider>
        </DataProvider>
      </RendererProvider>
    </ConfigProvider>
  );
}
