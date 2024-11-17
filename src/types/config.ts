import type {
  DayViewConfig,
  WeekViewConfig,
  GroupViewConfig,
  MonthViewConfig,
} from "@/components/views";

export type SlotDuration = 10 | 15 | 30 | 60;

export type ConfigOptions = {
  /**
   * Duration (in minutes) of a single time slot shown. Used for Day, Week, Group views
   * @default 30
   */
  slotDuration: SlotDuration;
  /**
   * Height (in pixels) of a single time slot. Used for Day, Week, Group views
   * @default 40
   */
  slotHeight: number;
  /**
   * Maximum number of event tiles that can be shown in a single time slot.
   * @default Infinity
   */
  maxEventsPerSlot: number;
  /**
   * Format of the hour start label.
   * @default hh:mm e.g. 16:45
   */
  hourIndicatorLabelFormat: string;
  /**
   * Whether to show separator lines for each slot in Day, Week, Group views. Hour indication separators are shown by default.
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
   *
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
   * @default start
   */
  scrollTimeIntoView: Date;
  /**
   * Sets the maximum viewport height of the calendar view.
   * @default undefined
   */
  maxViewHeight: number;
};

export type LocaleOptions = {
  weekStartsOn: "monday" | "sunday";
};

type CommonConfig = Pick<
  ConfigOptions,
  | "hourIndicatorLabelFormat"
  | "maxEventsPerSlot"
  | "scrollTimeIntoView"
  | "showAllDaySlot"
  | "showCurrentTimeMarker"
  | "showSlotIndicators"
  | "showSlotSeparator"
  | "slotDuration"
  | "slotHeight"
  | "maxViewHeight"
>;

export interface RootConfig {
  /**
   * Common configuration across multiple views
   */
  common?: Partial<CommonConfig>;
  locale?: Partial<LocaleOptions>;
  /**
   * View specific configuration
   * @note Overrides common configuration
   */
  views?: {
    day?: Partial<DayViewConfig>;
    week?: Partial<WeekViewConfig>;
    month?: Partial<MonthViewConfig>;
    group?: Partial<GroupViewConfig>;
  };
}
