import type {
  DayViewConfig,
  WeekViewConfig,
  GroupViewConfig,
  MonthViewConfig,
} from "@/components/views";
import type { LocaleOptions } from "./locale";

/**
 * Allowed values for time slot duration
 * to keep the slot height and alignment consistent.
 */
export type SlotDuration = 5 | 10 | 15 | 20 | 30 | 60;

export type TimeRange = { start: Date; end: Date };

export type ConfigOptions = {
  /**
   * Duration (in minutes) of a single time slot shown. Used for Day, Week, Group views
   * @default 30
   */
  slotDuration: SlotDuration;
  /**
   * Height (CSS height value) of a single time slot. Used for Day, Week, Group views
   * @default 40
   */
  slotHeight: string;
  /**
   * Maximum number of event tiles that can be shown in a single time slot.
   * @default Infinity
   */
  maxEventsPerSlot: number;
  /**
   * Whether to show separator lines for each slot in Day, Week, Group views.
   * Hour indication separators are shown by default.
   * @default false
   */
  showSlotSeparator: boolean;
  /**
   * Whether to show labels for each time slot start. Hour start labels are shown by default.
   * @default false
   */
  showSlotIndicators: boolean;
  /**
   * Whether to show current time marker in Day, Week, Group views.
   * @default true
   */
  showCurrentTimeMarker: boolean;
  /**
   * Whether to display all day slots in Day, Week, Group views.
   * @note When `false`, all day events will span from top to bottom.
   * @default true
   */
  showAllDaySlot: boolean;
  /**
   * Which slot start should the view render at in Day, Week, Group views.
   * When passed a `Date`, it will show the closest slot indicator at the top.
   * When passed a `number` expecting between 0-1, it will be used as a percentage
   * of available time span to show it at the top.
   * @default start
   */
  initialTimeAtTop: Date | number;
  /**
   * When `true`, the events having timeZone specified
   * will appear in their respective timeZones irrespective of locale timeZone.
   * @default false
   */
  useTimeZonedEvents: boolean;
  /**
   * Range (i.e. start and end) of a day in time grid based view
   * @default full
   */
  dayRange: TimeRange;
};

type CommonConfig = Pick<
  ConfigOptions,
  | "maxEventsPerSlot"
  | "initialTimeAtTop"
  | "showAllDaySlot"
  | "showCurrentTimeMarker"
  | "showSlotIndicators"
  | "showSlotSeparator"
  | "slotDuration"
  | "slotHeight"
  | "useTimeZonedEvents"
  | "dayRange"
>;

export interface RootConfig {
  /**
   * Common configuration across multiple views
   */
  config?: Partial<CommonConfig>;
  /**
   * Locale options for the Calendar
   */
  locale?: Partial<LocaleOptions>;
  /**
   * View specific configuration
   * @note Overrides common configuration
   */
  views?: {
    /** View specific config for Day View. */
    day?: Partial<DayViewConfig>;
    /** View specific config for Week View */
    week?: Partial<WeekViewConfig>;
    /** View specific config for Month View */
    month?: Partial<MonthViewConfig>;
    /** View specific config for Group View */
    group?: Partial<GroupViewConfig>;
  };
}
