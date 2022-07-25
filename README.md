# liveClock

## [![Node.js Package](https://github.com/twihno/liveClock/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/twihno/liveClock/actions/workflows/npm-publish.yml)

---

A simple realtime clock using Web Components.

## Usage

```html
<live-clock
  twelve-hours="false"
  seconds-visible="true"
  blinking="true"
  separator=":"
></live-clock>
```

Available Parameters:
| | |
|-|-|
|`twelve-hours`|Use 12h format (AM/PM)|
|`seconds-visible`|Show seconds|
|`blinking`|The separator blinks every second|
|`separator`|Character between hours/minutes/seconds|

### Styling

This package doesn't provide any styling for the clock. This allows you to style the clock however your project requires it to look like.

Recommendation: Use a monospaced font
