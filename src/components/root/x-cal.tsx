import clsx from "clsx";

import type { RootConfig, CalendarData, RenderFunctions } from "@/types";
import { mergeDefaults } from "@/core/utils";
import {
  ConfigProvider,
  RendererProvider,
  DataProvider,
  LocaleProvider,
} from "@/providers";
import { Views } from "@/components/views";
import { defaults } from "./defaults";

import s from "@/design/base.module.scss";

type XCalProps<EventData, BackgroundEventData> = RootConfig &
  RenderFunctions<EventData, BackgroundEventData> &
  Omit<CalendarData<EventData, BackgroundEventData>, "backgroundEvents"> &
  Partial<
    Pick<CalendarData<EventData, BackgroundEventData>, "backgroundEvents">
  > & {
    className?: string;
  } & { style?: React.CSSProperties };

/**
 * Root component to use XCal Events Calendar
 */
export function XCal<EventData, BackgroundEventData>(
  props: XCalProps<EventData, BackgroundEventData>,
  ref: React.Ref<HTMLDivElement>
) {
  const ActiveView = Views[props.view] ?? defaults.view;

  const localeWithDefaults = mergeDefaults(props.locale ?? {}, defaults.locale);

  return (
    <ConfigProvider config={props}>
      <LocaleProvider locale={localeWithDefaults}>
        <RendererProvider renderers={props as RenderFunctions}>
          <DataProvider
            data={{
              backgroundEvents: props.backgroundEvents ?? [],
              date: props.date,
              events: props.events,
              view: props.view,
            }}
          >
            <div
              ref={ref}
              style={props.style}
              className={clsx(s.xCal, props.className)}
            >
              <ActiveView.Component />
            </div>
          </DataProvider>
        </RendererProvider>
      </LocaleProvider>
    </ConfigProvider>
  );
}
