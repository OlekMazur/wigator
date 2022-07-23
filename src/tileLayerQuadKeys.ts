/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2018 Aleksander Mazur
 *
 * Wigator is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Wigator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wigator. If not, see <https://www.gnu.org/licenses/>.
 */

import { Coords, TileLayer, TileLayerOptions } from 'leaflet'

interface ITileLayerQuadKeysOptions extends TileLayerOptions {
	/** Quad key. */
	qk?: string
}

export class TileLayerQuadKeys extends TileLayer {
	public getTileUrl = (coords: Coords) => {
		let x = coords.x
		let y = coords.y
		let z = this._getZoomForUrl()
		let qk = ''
		// compute quad key based on x,y,z
		while (z--) {
			qk = String.fromCharCode(0x30 | ((y & 1) << 1) | (x & 1)) + qk
			x >>= 1
			y >>= 1
		}
		if (x || y) {
			// coordinates seemigly out of bounds of the zoom range
			return ''
		}
		//console.log(coords.x, coords.y, qk)
		const options = this.options as ITileLayerQuadKeysOptions
		// set quad key as qk option
		options.qk = qk
		// overridden method will do the rest
		const url = super.getTileUrl(coords)
		// remove qk from options
		options.qk = undefined

		return url
	}
}

export function tileLayerQuadKeys(urlTemplate: string, options?: TileLayerOptions): TileLayerQuadKeys {
	return new TileLayerQuadKeys(urlTemplate, options)
}
