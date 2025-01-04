import type { TimeUtils } from "@/core/temporal";
import { arrayToMap, clamp } from "@/core/utils";
import type { BaseEventTile, TileEvent } from "@/types";

/**
 * Day view tile representaion
 */
export type Tile<Event extends TileEvent> = {
  columnIndex: number;
  /**
   * Positional and dimensional properties of the tile
   */
  geometry: {
    /**
     * x-axis offset of the tile start from left edge of containing column
     */
    xOffset: number;
    /**
     * Ratio of width of the tile with respect to the column width
     * @example 0.2 or 0.5
     */
    width: number;
    /**
     * Starting line of the tile on y-axis
     */
    yStart: number;
    /**
     * Ending line of the tile on y-axis
     */
    yEnd: number;
  };
  link: {
    next: Set<Tile<Event>>;
    prev: Set<Tile<Event>>;
  };
} & BaseEventTile<Event>;

type Column<Event extends TileEvent> = {
  bottomEnd: Date;
  lastTile: Tile<Event>;
};

type TilerConfig = {
  /** Limit the maximum number of events that can appear in a single row */
  maxPerSlot: number;
  /** Length or duration of a single slot in minutes */
  slotDuration: number;
};

const UNSET_VALUE = -1;

export class DayTiler<Event extends TileEvent> {
  private slotsInDay: number;
  private range: { start: Date; end: Date } = {
    start: new Date(),
    end: new Date(),
  };
  constructor(
    private readonly config: TilerConfig,
    private readonly time: TimeUtils
  ) {
    this.slotsInDay = Math.floor(
      this.time.minutesInDay / this.config.slotDuration
    );
  }

  private getYOffset(time: Date, bound: "start" | "end"): number {
    const offsetMinutes = this.time.getTimeOffsetFromDateInMinutes(
      this.range.start,
      time
    );
    const clampedOffset = clamp(0, this.time.minutesInDay, offsetMinutes);
    const offset = (clampedOffset / this.time.minutesInDay) * this.slotsInDay;

    return bound === "start" ? Math.floor(offset) : Math.ceil(offset);
  }

  /**
   * Creates a tile for each of the event
   */
  private createTiles(events: Event[]): Tile<Event>[] {
    const tiles: Tile<Event>[] = events.map((event, i) => ({
      id: i + 1,
      event,
      link: {
        next: new Set(),
        prev: new Set(),
      },
      columnIndex: UNSET_VALUE,
      geometry: {
        xOffset: UNSET_VALUE,
        width: UNSET_VALUE,
        yStart: this.getYOffset(event.startsAt, "start"),
        yEnd: this.getYOffset(event.endsAt, "end"),
      },
      continuous: {
        start: this.time.isBefore(event.startsAt, this.range.start),
        end: this.time.isAfter(event.endsAt, this.range.end),
      },
    }));

    const visibleTiles = tiles.filter(
      (t) => t.geometry.yStart !== t.geometry.yEnd
    );

    return visibleTiles;
  }

  /**
   * Arranges the tiles in columns,
   * also setting forward and backward links to create a graph
   */
  private setColumns(tiles: Tile<Event>[]) {
    const columns: Column<Event>[] = [];

    tiles.forEach((tile) => {
      const event = tile.event;
      let colIdx = 0;

      // Find the column where the current tile can fit
      while (columns[colIdx] && columns[colIdx].bottomEnd > event.startsAt)
        colIdx++;

      if (colIdx + 1 > this.config.maxPerSlot) return;

      tile.columnIndex = colIdx;

      // Add to either a new column or existing column
      if (!columns[colIdx]) {
        columns[colIdx] = { bottomEnd: event.endsAt, lastTile: tile };
      } else {
        columns[colIdx].lastTile = tile;
        columns[colIdx].bottomEnd = event.endsAt;
      }

      // Get connected tile from last column and add links
      const lastCollidingTile = columns[colIdx - 1]?.lastTile;
      if (lastCollidingTile) {
        lastCollidingTile.link.next.add(tile);
        tile.link.prev.add(lastCollidingTile);
      }

      // Get ahead of line blocking tile
      let blockingColIdx = colIdx + 1;
      while (columns[blockingColIdx]) {
        if (columns[blockingColIdx].bottomEnd > event.startsAt) {
          const blockingTile = columns[blockingColIdx].lastTile;
          tile.link.next.add(blockingTile);
          blockingTile.link.prev.add(tile);
          // Remove crossing link
          if (lastCollidingTile) {
            lastCollidingTile.link.next.delete(blockingTile);
            blockingTile.link.prev.delete(lastCollidingTile);
          }
          break;
        }
        blockingColIdx++;
      }
    });

    return tiles.filter((tile) => tile.columnIndex !== UNSET_VALUE);
  }

  /**
   * Calculates the width of a given tile from a list of connected tiles
   * @param connectedTiles Tile's array of connected tiles
   * @param tileIdx Index/Zero based position of the tile in array of connected tiles
   * @param tileXOffset Calculated x-offset of the tile
   * @returns width of the tile
   */
  private calculateTileWidth(
    connectedTiles: Tile<Event>[],
    tileIdx: number,
    tileXOffset: number
  ): number {
    // If there is tile ahead of line blocking the given tile
    for (let i = tileIdx + 1; i < connectedTiles.length; ++i) {
      if (connectedTiles[i].geometry.xOffset !== UNSET_VALUE)
        return (
          (connectedTiles[i].geometry.xOffset - tileXOffset) / (i - tileIdx)
        );
    }

    // Else calculate remaining proportional width
    let unsetTiles = 0,
      occupiedWidth = 0;
    for (let i = 0; i < connectedTiles.length; ++i) {
      if (connectedTiles[i].geometry.width !== UNSET_VALUE)
        occupiedWidth += connectedTiles[i].geometry.width;
      else unsetTiles++;
    }

    return (1 - occupiedWidth) / (unsetTiles || 1);
  }

  /**
   * Gets the array of tiles of events for a given date with layouting details
   */
  getLayoutTiles(events: Event[], options: { date: Date }): Tile<Event>[] {
    this.range = {
      start: this.time.startOfDay(options.date),
      end: this.time.endOfDay(options.date),
    };

    // Splits the recurring events into individual occurrences/events
    const eventOccurrences = events.flatMap((event) => {
      if (!event.recurrencePattern) return [event];
      const rrule = this.time.parseRecurrencePattern(event.recurrencePattern);
      const occurrences = rrule.between(this.range.start, this.range.end, true);
      return occurrences.map((occurrence) => ({
        ...event,
        startsAt: occurrence,
        endsAt: new Date(
          occurrence.getTime() +
            (event.endsAt.getTime() - event.startsAt.getTime())
        ),
      }));
    });

    // Create tiles from events
    const eventTiles = this.createTiles(eventOccurrences);

    // Arrange tiles by earliest and lengthiest first
    eventTiles.sort(
      (tileA, tileB) =>
        tileA.geometry.yStart - tileB.geometry.yStart ||
        tileB.geometry.yEnd - tileA.geometry.yEnd
    );

    // Add forward and backward links between tiles and arrange in columns
    const columnedTiles = this.setColumns(eventTiles);

    // Find the longest connected tiles with all tiles covered
    const connectedComponents = new ConnectedComponents(columnedTiles);
    connectedComponents.crawl();
    const connectedTilesList = connectedComponents.getLongestPaths();

    // Assign x-axis geometry values
    connectedTilesList.forEach((connectedTiles) => {
      connectedTiles.forEach((tile, idx) => {
        // Calculate the nudge amount based on previous tile in line
        const previousTile = connectedTiles[idx - 1];
        if (tile.geometry.width === UNSET_VALUE) {
          tile.geometry.xOffset = previousTile
            ? previousTile.geometry.width + previousTile.geometry.xOffset
            : 0;

          tile.geometry.width = this.calculateTileWidth(
            connectedTiles,
            idx,
            tile.geometry.xOffset
          );
        }
      });
    });

    return columnedTiles;
  }
}

type NodeType = {
  id: string | number;
  link: {
    next: Set<NodeType>;
    prev: Set<NodeType>;
  };
};

type LongestPath = { neighbor: NodeType | null; length: number };

/**
 * Connected components utility class for graph of nodes
 */
class ConnectedComponents<Node extends NodeType> {
  private longestPaths: {
    forward: Map<Node["id"], LongestPath>;
    backward: Map<Node["id"], LongestPath>;
  };
  private nodesById: Partial<Record<Node["id"], Node>>;

  constructor(private readonly nodes: Node[]) {
    this.longestPaths = { forward: new Map(), backward: new Map() };
    this.nodesById = arrayToMap(nodes, (n) => n.id);
  }

  /**
   * Depth first search for the given node's longest path
   */
  private getLongestPathNeighbor(
    node: NodeType,
    direction: "next" | "prev",
    cache: Map<Node["id"], LongestPath>
  ): LongestPath {
    const cachedLongestPath = cache.get(node.id);
    if (cachedLongestPath) return cachedLongestPath;

    let longestPath: LongestPath = { neighbor: null, length: 0 };
    for (const neighbor of node.link[direction]) {
      const neighborsLongestPath = this.getLongestPathNeighbor(
        neighbor,
        direction,
        cache
      );
      if (neighborsLongestPath.length + 1 > longestPath.length)
        longestPath = { neighbor, length: neighborsLongestPath.length + 1 };
    }

    cache.set(node.id, longestPath);
    return longestPath;
  }

  /** Finds longest forward and backward paths for all nodes */
  crawl() {
    this.nodes.forEach((n) =>
      this.getLongestPathNeighbor(n, "next", this.longestPaths.forward)
    );

    this.nodes.forEach((n) =>
      this.getLongestPathNeighbor(n, "prev", this.longestPaths.backward)
    );
  }

  /**
   * Gets the array of ids of the nodes
   * in the longest path of given node in given direction
   */
  private getFlattenedPath(
    node: Node,
    direction: "forward" | "backward"
  ): Node["id"][] {
    const path: Node["id"][] = [];

    const longestPaths = this.longestPaths[direction];

    let neighbor = longestPaths.get(node.id)?.neighbor;
    while (neighbor) {
      path.push(neighbor.id);
      neighbor = longestPaths.get(neighbor.id)?.neighbor;
    }

    return path;
  }

  /**
   * For all the nodes, gets all the unique longest paths
   * such that each node appears atleast one time in any of the longest path
   */
  getLongestPaths() {
    const seen = new Set<string>();
    const paths: Node[][] = [];
    for (const node of this.nodes) {
      const forwardPath = this.getFlattenedPath(node, "forward");
      const backwardPath = this.getFlattenedPath(node, "backward").reverse();

      const path = backwardPath.concat([node.id]).concat(forwardPath);

      const key = path.join();
      if (!seen.has(key)) {
        seen.add(key);
        paths.push(path.map((nodeId) => this.nodesById[nodeId]!));
      }
    }
    return paths.sort((a, b) => b.length - a.length);
  }
}
