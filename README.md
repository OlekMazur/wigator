Very simple Leaflet-based interactive map
=========================================

It bundles into a single HTML file.
It shows current position and pre-defined POIs on a map.
The map background can use either online OSM-compatible raster tiles, or an offline map bundle.

Firefox
-------

The app works e.g. in Firefox Fennec available at F-Droid.
Just enable geolocation for file:// pages and set the following in about:config:
```
privacy.file_unique_origin = false
privacy.reduceTimerPrecision = false
privacy.resistFingerprinting = false
```

Offline map bundle format
-------------------------

The file begins with a header which is a nul-terminated string containg a JSON object
with following properties:

| Name | Value |
| ---- | ----- |
| id   | `wigator` |
| version | `1` |
| zoomMin | Minimal value of Z coordinate, e.g. `15` |
| zooms   | An array of objects describing range of tiles at each available zoom level, starting from `zoomMin` |

Each object inside `zooms` array contains following properties: `x`, `y`, `w`, `h`
and describes tiles available at particular zoom level (`w` tiles horizotally starting from `x`,
`h` tiles vertically starting from `y`).

Example:
```
{
	"id": "wigator",
	"version": 1,
	"zoomMin": 15,
	"zooms": [
		{ "x": 17212, "y": 11709, "w": 19, "h": 27 },
		{ "x": 34424, "y": 23419, "w": 38, "h": 53 }
	]
}
```

The length of the header cannot exceed 4 KB including the terminating zero.

The header is followed by binary arrays of offsets of tile data.
For each zoom level (= length of `zooms` array) there are `w` * `h` big-endian 32-bit unsigned integers
holding offset of the tile image at related position.
Offset of the next tile determines the end of the image of the current tile.
At the end of those arrays there is one extra offset provided just
for determining the end of the last tile.

License
=======

This file is part of Wigator.

Wigator is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

Wigator is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the [GNU General Public License]
along with Wigator. If not, see <https://www.gnu.org/licenses/>.
