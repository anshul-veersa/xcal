# Event Calendar React Component

## Features
- **Customizable**: Easily customize different parts of the calendar using render functions. Configure styles with CSS variables for full flexibility.
- **Timezone Support**: Supports both a global timezone for the entire calendar and individual timezones for each event.
- **Lightweight**: The calendar's views are optimized to be small, with each view only a few KBs in size.

## Available Views
- **Month View**: Displays events within a day grid for a specific month.
- **Week View**: A time-based grid view that shows events for each day of the selected week.
- **Day View**: A time-based grid view that displays events for the selected day.
- **Group View**: Groups events using a group selector. Currently available only as a time grid view.

## Installation

First, install the component via npm or yarn:

```bash
npm install event-calendar
# or
pnpm add event-calendar
```


## Usage
The library exports a single component, `XCal`, which you can use to display the calendar. All configurations are handled via props.


> [!IMPORTANT]
>  Wrap the `<XCal />` component inside a React.Suspense boundary, as the views are loaded lazily.

#### Minimal Usage Example
```tsx
<React.Suspense fallback={<Loading />}>
  <XCal
    date={viewDate}
    events={events}
    renderEventTile={CalendarEventTile}
    view='week'
  />
</React.Suspense>;
```
