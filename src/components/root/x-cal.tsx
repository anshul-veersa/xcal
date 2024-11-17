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
            <div className='xcal'>{<ActiveView.Component />}</div>
          </TimeProvider>
        </DataProvider>
      </RendererProvider>
    </ConfigProvider>
  );
}

// <XCal
//   date={new Date()}
//   events={[
//     {
//       id: 1,
//       startsAt: new Date("2024-11-17"),
//       endsAt: new Date(),
//       data: {
//         myData: 1,
//       },
//     },
//   ]}
//   renderEventTile={(props) => <div>{props.view === 'day' ? props.tile.event.data?.myData}</div>}
//   view='day'
//   renderHeaderItem={(props) => props.view === 'day' ? props.data.date}
//   renderTimeSlot={(props) => <div>{props.view === 'day' ? props.slot.backgroundEvents[1].}</div>}
//   backgroundEvents={[
//     {
//       data: { f: 1 },
//       endsAt: new Date(),
//       startsAt: new Date(),
//       id: 1,
//       priority: 1,
//     },
//   ]}
// />;
