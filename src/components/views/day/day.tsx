import { ColumnGrid } from "@/components/abstract-views";
import { useConfig } from "@/providers/config/context";
import { useData } from "@/providers/data/context";
import { useRenderer } from "@/providers/renderer/context";

export default function DayView() {
  const rootConfig = useConfig();
  const data = useData();
  const renderer = useRenderer();

  const dayColumn = {
    id: data.date.getDate(),
    date: data.date,
    header: {
      data: {},
      attributes: {},
    },
    events: data.events,
    backgroundEvents: data.backgroundEvents,
    attributes: {},
  };

  return (
    <div className='day-view'>
      <ColumnGrid
        activeDate={data.date}
        columns={[dayColumn]}
        config={{hourIndicatorLabelFormat: rootConfig.}}
        renderEventTile={renderer.renderEventTile}
        renderHeaderItem={}
        renderTimeSlot={}
      />
    </div>
  );
}
