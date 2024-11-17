import type {
  TileEvent,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
} from "@/types";
import { RendererContext } from "./context";

export function RendererProvider(props: {
  renderers: {
    renderEventTile: EventTileRenderFunction<TileEvent>;
    renderHeaderItem?: HeaderItemRenderFunction;
    renderTimeSlot?: TimeSlotRenderFunction;
  };
  children: React.ReactNode;
}) {
  return (
    <RendererContext.Provider value={props.renderers}>
      {props.children}
    </RendererContext.Provider>
  );
}
