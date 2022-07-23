/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2018, 2020 Aleksander Mazur
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

import {
	Coords, LatLngBounds, point,
	DoneCallback, TileLayer, TileLayerOptions,
	Map,
} from 'leaflet'
import { IMapFile, loadMapFiles } from './mapFiles'
import { showAlert, hideAlert } from './alert'

/**************************************/

class MapFileLayer extends TileLayer {
	private files: IMapFile[] = []
	private addID?: object
	private tileSize = 256	// this.getTileSize() is wrong since it takes retina into account
	// while we need size of the original image here

	constructor(private fileNames: string[], options?: TileLayerOptions) {
		super('', options)
	}

	public readonly onAdd = (map: Map): this => {
		const addID = {}
		this.addID = addID

		showAlert()

		loadMapFiles(this.fileNames)
		.then((files) => {
			if (this.addID !== addID) {
				console.info('Too late')
				return
			}

			this.files = files

			this.options.minZoom = NaN
			this.options.maxZoom = NaN
			let bounds: LatLngBounds | undefined
			for (const file of files) {
				if (!(this.options.minZoom <= file.zoomBasic))
					this.options.minZoom = file.zoomBasic
				if (!(this.options.maxZoom >= file.zoomBasic + file.zooms.length - 1))
					this.options.maxZoom = file.zoomBasic + file.zooms.length - 1
				for (let zOfs = 0; zOfs < file.zooms.length; zOfs++) {
					const z = file.zoomBasic + zOfs
					let x = file.zooms[zOfs].x
					let y = file.zooms[zOfs].y
					let p = map.unproject(point(x * this.tileSize, y * this.tileSize), z)
					if (bounds)
						bounds.extend(p)
					else
						bounds = p.toBounds(0)
					x += file.zooms[zOfs].w
					y += file.zooms[zOfs].h
					p = map.unproject(point(x * this.tileSize - 1, y * this.tileSize - 1), z)
					bounds.extend(p)
				}
			}
			if (isNaN(this.options.minZoom))
				this.options.minZoom = 0
			if (isNaN(this.options.maxZoom))
				this.options.maxZoom = 18
			if (this.options.zoomOffset) {
				// retina correction
				if (!this.options.zoomReverse) {
					this.options.maxZoom -= this.options.zoomOffset
					if (this.options.maxZoom < 0)
						this.options.maxZoom = 0
				} else {
					this.options.minZoom -= this.options.zoomOffset
					if (this.options.minZoom < 0)
						this.options.minZoom = 0
				}
			}
			// let the user be happy
			this.options.minNativeZoom = this.options.minZoom
			this.options.maxNativeZoom = this.options.maxZoom
			if (this.options.minZoom)
				this.options.minZoom--
			this.options.maxZoom++

			this.options.bounds = bounds
			// TODO: is our layer still added to this map?
			;
			(map as any)._addZoomLimit(this)
			;
			(this as any)._resetView()
			if (bounds) {
				//console.log(bounds)
				//map.setMaxBounds(bounds)
				map.panInsideBounds(bounds)
			}
			this.redraw()

			hideAlert()
		})

		super.onAdd(map)
		return this
	}

	public readonly onRemove = (map: Map): this => {
		this.addID = undefined
		super.onRemove(map)
		this.files = []
		return this
	}

	protected readonly createTile = (coords: Coords, done: DoneCallback): HTMLElement => {
		let tile: HTMLElement | undefined
		const realZ = this._getZoomForUrl()	// value in coords.z is wrong when retina
		let f = 0
		let x = NaN
		let y = NaN
		let z = NaN

		for (; f < this.files.length; f++) {
			const file = this.files[f]
			z = realZ - file.zoomBasic
			if (z < 0 || z >= file.zooms.length)
				continue
			const zoom = file.zooms[z]
			x = coords.x - zoom.x
			y = coords.y - zoom.y
			if (x < 0 || x >= zoom.w || y < 0 || y >= zoom.h)
				continue
			break
		}

		if (f < this.files.length) {
			const file = this.files[f]
			const zoom = file.zooms[z]
			const offset = 4 * (zoom.offset + y * zoom.w + x)
			const offsetCurr = file.directory.getUint32(offset)
			const offsetNext = file.directory.getUint32(offset + 4)

			if (offsetNext > offsetCurr) {
				tile = super.createTile(coords, () => {
					// ignore "done" callback
				})

				const fr = new FileReader()
				fr.onload = function() {
					const img = tile as HTMLImageElement
					img.src = fr.result as string
					done(undefined, tile)
				}
				fr.onerror = function(e) {
					console.warn(f, z, x, y, e)
					done(fr.error || new Error('null'))
				}
				fr.readAsDataURL(file.blob.slice(offsetCurr, offsetNext))
			}
		}

		if (!tile) {
			//console.log('Z:', realZ, coords.z, z, 'X:', coords.x, x, 'Y:', coords.y, y, 'F:', f, this.files)

			tile = document.createElement('div')
			tile.className = 'tile-placeholder'
			tile.appendChild(document.createTextNode(coords.x + ' x ' + coords.y))
			setTimeout(function() {
				done(undefined, tile)
			}, 100)
		}

		return tile
	}

	public readonly getTileUrl = () => ''
}

/**************************************/

export function mapFileLayer(files: string[], options?: TileLayerOptions) {
	return new MapFileLayer(files, options)
}
