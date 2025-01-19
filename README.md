# Event Calendar React Component

## Features
- **Customizable** - Using render functions, different parts of the calendar can be custom made. Also allows configuring of styles using css variables.
- **Timezone Support** - Supports calendar wide timezone as well as per event timezone.
- **Lightweight** - Each view is just a few KBs in size.

## Available Views
### Month View
Displays given events in a day grid for a given month.

### Week View
A time grid view showing events for each day of the given week.

### Day View
A time grid view showing events for the given day.

### Group View
Display given events under groups using group selector. Currently only available as time grid.


## Usage
The library exports only a single component to use the calendar. All the options are configurable using props. 


> The component needs to be wrapped inside a `React.Suspense` boundary because the views are lazily loaded

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
