import type {
  DayViewConfig,
  WeekViewConfig,
  GroupViewConfig,
  MonthViewConfig,
  Views,
} from "@/components/views";

export type SlotDuration = 10 | 15 | 30 | 60;

export type View = keyof typeof Views;

export type CommonConfig = {
  slotDuration: SlotDuration;
  slotHeight: number;
  maxEventsPerSlot: number;
  showSlotSeparator: boolean;
  showSlotIndicators: boolean;
  showCurrentTimeMarker: boolean;
  showAllDaySlot: boolean;
  hourIndicatorLabelFormat: string;
  scrollTimeIntoView: Date;
};

export type LocaleOptions = {
  weekStartsOn: "monday" | "sunday";
};

export interface XCalConfig<EventData, BackgroundEventData> {
  view: View;
  config?: Partial<CommonConfig>;
  locale?: Partial<LocaleOptions>;
  views?: {
    day: Partial<DayViewConfig>;
    week: Partial<WeekViewConfig>;
    month: Partial<MonthViewConfig>;
    group: Partial<GroupViewConfig<EventData, BackgroundEventData>>;
  };
}
