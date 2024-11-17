import type {
  TileEvent,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
  TimeGridCornerRenderFunction,
} from "@/types";
import { RendererContext } from "./context";

export function RendererProvider(props: {
  renderers: {
    renderEventTile: EventTileRenderFunction<TileEvent>;
    renderHeaderItem?: HeaderItemRenderFunction;
    renderTimeSlot?: TimeSlotRenderFunction;
    renderTimeGridCorner?: TimeGridCornerRenderFunction;
  };
  children: React.ReactNode;
}) {
  return (
    <RendererContext.Provider value={props.renderers}>
      {props.children}
    </RendererContext.Provider>
  );
}
