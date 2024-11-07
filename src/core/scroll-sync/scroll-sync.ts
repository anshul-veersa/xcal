export class ScrollSync {
  private syncedScrollElements: { x: HTMLElement[]; y: HTMLElement[] };
  private abortController: AbortController;

  constructor(private readonly selector: string) {
    const elementsToSync = Array.from<HTMLElement>(
      document.querySelectorAll(`[${selector}]`)
    );

    this.syncedScrollElements = {
      x: elementsToSync.filter((el) =>
        ["x", "all"].includes(el.getAttribute(selector)!)
      ),
      y: elementsToSync.filter((el) =>
        ["y", "all"].includes(el.getAttribute(selector)!)
      ),
    };

    this.abortController = new AbortController();
  }

  mount() {
    this.syncedScrollElements.x.forEach((container) =>
      container.addEventListener(
        "scroll",
        () => this.syncScroll(container, this.syncedScrollElements.x, "x"),
        { passive: true, signal: this.abortController.signal }
      )
    );
    this.syncedScrollElements.y.forEach((container) =>
      container.addEventListener(
        "scroll",
        () => this.syncScroll(container, this.syncedScrollElements.y, "y"),
        { passive: true, signal: this.abortController.signal }
      )
    );
  }

  private syncScroll(
    source: HTMLElement,
    targets: HTMLElement[],
    axis: "x" | "y"
  ) {
    targets.forEach((target) => {
      if (axis === "x") target.scrollLeft = source.scrollLeft;
      if (axis === "y") target.scrollTop = source.scrollTop;
    });
  }

  destroy() {
    this.abortController.abort();
  }
}
