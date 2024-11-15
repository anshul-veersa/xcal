import type {
  CalendarEvent,
  BaseEvent,
  EventTileRenderFunction,
} from "@/types";
import { createContext, useContext } from "react";

type RendererContextType<CalendarEvent extends BaseEvent> = {
  renderEventTile: EventTileRenderFunction<CalendarEvent>;
};

export const RendererContext =
  createContext<RendererContextType<CalendarEvent> | null>(null);

/** Use events and other data */
export function useRenderer() {
  const renderers = useContext(RendererContext);
  if (!renderers) throw new Error("Renderer context is not defined.");
  return renderers;
}
