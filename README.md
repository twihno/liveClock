# liveClock

[![Node.js Package](https://github.com/twihno/liveClock/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/twihno/liveClock/actions/workflows/npm-publish.yml)
![GitHub](https://img.shields.io/github/license/twihno/liveclock)
![npm](https://img.shields.io/npm/v/liveclock)

A simple realtime clock using Web Components.

## Examples
https://twihno.github.io/liveClock/

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
| | |default|
|-|-|-|
|`twelve-hours`|Use 12h format (AM/PM)|false|
|`seconds-visible`|Show seconds|false|
|`blinking`|The separator blinks every second|false|
|`separator`|Character between hours/minutes/seconds|:|

### Styling

This package doesn't provide any styling for the clock. This allows you to style the clock however your project requires it to look like.

Recommendation: Use a monospaced font
