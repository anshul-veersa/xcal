import { ConfigProvider } from "@/providers/config";
import { TimeProvider } from "@/providers/temporal";
import { RendererProvider } from "@/providers/renderer";
import { DataProvider } from "@/providers/data";
import { CallbacksProvider } from "@/providers/callbacks";
import { Views } from "@/components/views";
import { defaults } from "./defaults";

import type {
  RootConfig,
  CalendarData,
  RenderFunctions,
  Callbacks,
} from "@/types";

import s from "@/design/base.module.scss";

type XCalProps<EventData, BackgroundEventData> = Partial<Callbacks<EventData>> &
  RenderFunctions<EventData, BackgroundEventData> &
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
      <RendererProvider renderers={props as RenderFunctions<unknown, unknown>}>
        <CallbacksProvider callbacks={props as Callbacks<unknown>}>
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
        </CallbacksProvider>
      </RendererProvider>
    </ConfigProvider>
  );
}
