/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2018, 2024 Aleksander Mazur
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

import { fetch as polyFetch } from 'whatwg-fetch'
import { startAlert } from './alert'

const fetch = window.fetch || polyFetch

/**************************************/

interface IDimensions {
	x: number
	y: number
	w: number
	h: number
}

const isDimensions = (zoom: any): zoom is IDimensions =>
	!!zoom
	&& typeof zoom === 'object'
	&& typeof zoom.x === 'number'
	&& typeof zoom.y === 'number'
	&& typeof zoom.w === 'number'
	&& typeof zoom.h === 'number'

interface IMapFileHeader {
	id: string
	version: number
	zoomMin: number
	zooms: IDimensions[]
}

const isMapFileHeader = (hdr: any): hdr is IMapFileHeader =>
	typeof hdr === 'object' &&
	hdr.id === 'wigator' &&
	typeof hdr.version === 'number' && hdr.version >= 1 &&
	typeof hdr.zoomMin === 'number' &&
	Array.isArray(hdr.zooms) &&
	hdr.zooms.every((zoom: any) => isDimensions(zoom))

export interface IMapFileZoom extends IDimensions {
	offset: number
}

export interface IMapFile {
	zoomBasic: number
	zooms: IMapFileZoom[]
	blob: Blob
	directory: DataView
}

/**************************************/

function loadMapFile(blob: Blob, elem: HTMLElement | null) {
	let index: number

	return new Promise((resolve: (result: ArrayBuffer) => void, reject: (e: Error) => void) => {
		const fr = new FileReader()
		fr.onload = (e) => {
			if (e.target && e.target.result && typeof e.target.result === 'object')
				resolve(e.target.result)
			reject(new Error('Nieprawidłowy plik'))
		}
		fr.readAsArrayBuffer(blob.slice(0, 4096))
	}).then((array: ArrayBuffer) => new Promise((resolve: (result: IMapFileHeader) => void, reject: (e: Error) => void) => {
		const buf = new Uint8Array(array)
		index = buf.indexOf(0)
		if (index <= 0)
			throw new Error('Nieprawidłowy plik (a)')
		const hdrBlob = new Blob([buf.slice(0, index)], { type: 'application/json' })
		const fr = new FileReader()
		fr.onload = (e) => {
			if (e.target && typeof e.target.result === 'string') {
				const hdr = JSON.parse(e.target.result)
				if (isMapFileHeader(hdr))
					resolve(hdr)
			}
			reject(new Error('Nieprawidłowy plik (b)'))
		}
		fr.readAsText(hdrBlob)
	})).then((hdr: IMapFileHeader) => new Promise((resolve: (result: IMapFile) => void, reject: (e: Error) => void) => {
		const zooms: IMapFileZoom[] = []
		let offset = 0
		for (let zoom = 0, len = hdr.zooms.length; zoom < len; zoom++) {
			const z = zooms[zoom] = {
				...hdr.zooms[zoom],
				offset,
			}
			offset += z.w * z.h
		}
		if (elem)
			elem.innerHTML = 'v' + hdr.version + ': ' + offset + ' (' +
				hdr.zoomMin + '-' + (hdr.zoomMin + hdr.zooms.length - 1) + ')'
		const fr = new FileReader()
		fr.onload = (e) => {
			if (e.target && e.target.result && typeof e.target.result === 'object')
				resolve({
					zoomBasic: hdr.zoomMin,
					zooms,
					blob,
					directory: new DataView(e.target.result),
				})
			reject(new Error('Nieprawidłowy plik (c)'))
		}
		index++
		offset++
		fr.readAsArrayBuffer(blob.slice(index, index + offset * 4))
	}))
}

/**************************************/

function createTable(prefix: string, div: HTMLElement | null, names: string[]) {
	if (!div)
		return

	const table = document.createElement('table')
	let container = document.createElement('thead')
	{
		const tr = document.createElement('tr')
		const td1 = document.createElement('td')
		//const td2 = document.createElement('td')
		//const td3 = document.createElement('td')
		const td4 = document.createElement('td')
		td1.innerHTML = 'Plik'
		//td2.innerHTML = 'Części'
		//td3.innerHTML = 'Bajty'
		td4.innerHTML = 'Wynik'
		tr.appendChild(td1)
		//tr.appendChild(td2)
		//tr.appendChild(td3)
		tr.appendChild(td4)
		container.appendChild(tr)
	}
	table.appendChild(container)
	container = document.createElement('tbody')
	for (const name of names) {
		const tr = document.createElement('tr')
		tr.className = 'smallmono'
		const td1 = document.createElement('td')
		//const td2 = document.createElement('td')
		//const td3 = document.createElement('td')
		const td4 = document.createElement('td')
		td1.innerHTML = name
		//td2.id = prefix + 'parts-' + name
		//td2.className = 'align-right'
		//td3.id = prefix + 'bytes-' + name
		//td3.className = 'align-right'
		td4.id = prefix + 'status-' + name
		tr.appendChild(td1)
		//tr.appendChild(td2)
		//tr.appendChild(td3)
		tr.appendChild(td4)
		container.appendChild(tr)
	}
	table.appendChild(container)
	div.appendChild(table)
}

export function loadMapFiles(mapFiles: string[]): Promise<IMapFile[]> {
	const prefix = 'wigator-file-'
	createTable(prefix, startAlert(''), mapFiles)

	const maps: IMapFile[] = []
	return Promise.all(mapFiles.map((name) => {
		const elem = document.getElementById(prefix + 'status-' + name)
		let promise: Promise<Response>
		// tslint:disable-next-line:no-try-promise
		try {
			// catch Firefox's TypeError: NetworkError
			promise = fetch(name)
		} catch(_e) {
			promise = Promise.reject()
		}
		return promise
		.then((result) => {
			if (!result.ok)
				throw new Error(result.status + ' ' + result.statusText)
			if (result.body) {
				return result.arrayBuffer().then((value) => new Blob([value], { type: 'application/octet-stream' }))
			} else {
				if (elem)
					elem.innerHTML = 'blob'
				return result.blob()
			}
		}).then((blob) => loadMapFile(blob, elem))
		.then((map) => {
			maps.push(map)
		}).catch((e) => {
			if (elem)
				elem.innerHTML = e.name
			console.error(name, e)
		})
	})).then(() => maps)
}

/**************************************/
