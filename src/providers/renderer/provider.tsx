import type { TileEvent, EventTileRenderFunction } from "@/types";
import { RendererContext } from "./context";

export function RendererProvider(props: {
  renderers: {
    renderEventTile: EventTileRenderFunction<TileEvent>;
  };
  children: React.ReactNode;
}) {
  return (
    <RendererContext.Provider value={props.renderers}>
      {props.children}
    </RendererContext.Provider>
  );
}
