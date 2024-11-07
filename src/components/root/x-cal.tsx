// interface for props

import { XCalConfig } from "@/types";

type XCalProps<E, B> = {
  date: Date;
} & XCalConfig<E, B>;

export function XCal<EventData, BackgroundEventData>(
  props: XCalProps<EventData, BackgroundEventData>
) {
  return <div></div>;
}
