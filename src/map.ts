/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2018, 2020, 2022 Aleksander Mazur
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
	map, Map,
	marker, Marker,
	icon,
	popup, Popup,
	control, Control,
	latLng, LatLng,
	LeafletEvent, LocationEvent, LeafletMouseEvent, PopupEvent,
	TileLayerOptions, TileLayer, tileLayer,
	geoJSON,
} from 'leaflet'
import { GeoJsonObject } from 'geojson'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { formatNumber, formatLatLng, formatTS } from './utils'
import { storageLoadNumber, storageSaveNumber } from './storage'
import { myToolBar } from './toolbar'
import { hideMenu } from './menu'
import { notifyAdd, notifyUpdate } from './notify'
import { options } from './options'
import { tileLayerQuadKeys } from './tileLayerQuadKeys'
import { mapFileLayer } from './mapLayer'

/**************************************/

let myMap: Map
let myPosMarkerPopup: Popup
let myPosMarker: Marker
Marker.prototype.options.icon = icon({
	iconUrl,
	iconRetinaUrl,
	shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41],
})
let myLastLocation: LatLng

export function mapLocate() {
	myMap.locate({
		enableHighAccuracy: true,
		timeout: 120000,
		watch: true,
	})
}

export function mapFollowLocation() {
	if (myMap && myLastLocation && options.follow) {
		myMap.panTo(myLastLocation)
		mapLocate()
	}
}

function handleLocationFound(e: LocationEvent) {
	if (!myPosMarker) {
		myPosMarker = marker(e.latlng)
		myPosMarker.addTo(myMap)
		myPosMarkerPopup = popup({
			autoPan: false,
			closeButton: false,
			className: 'location',
		}, myPosMarker)
		myPosMarker.bindPopup(myPosMarkerPopup)
	} else {
		myPosMarker.setLatLng(e.latlng)
	}
	let text = ''
	if (e.speed)
		text += '<strong>' + formatNumber(e.speed * 3.6) + ' km/h<br></strong>'
	text += formatLatLng(e.latlng, '<br>') + '<br>&pm;' + formatNumber(e.accuracy) + 'm'
	if (e.altitude) {
		text += '<br>' + formatNumber(e.altitude)
		if (e.altitudeAccuracy && e.altitudeAccuracy !== e.accuracy)
			text += ' &pm;' + formatNumber(e.altitudeAccuracy)
		text += 'm'
	}
	if (e.heading)
		text += '<br>' + formatNumber(e.heading) + '&deg;'
	if (e.timestamp) {
		text += '<br>' + formatTS(e.timestamp)
	}
	myPosMarkerPopup.setContent(text)

	myLastLocation = e.latlng
	mapFollowLocation()
	notifyUpdate(e.latlng, e.accuracy)
}

function handleLocationError(e: LeafletEvent) {
	console.log('handleLocationError', e)
}

function handleDblClick(e: LeafletMouseEvent) {
	marker(e.latlng)
	.bindPopup(formatLatLng(e.latlng, '<br>'), {
		autoPan: false,
		closeButton: false,
		className: 'location',
	}).addTo(myMap).on('popupclose', function(ev: PopupEvent) {
		ev.target.remove()
	}).openPopup()
}

export function mapStart(id: string) {
	myMap = map(id, {
		attributionControl: false,
		zoomControl: false,
		doubleClickZoom: false,
		//fadeAnimation: false,
	})

	const lat = storageLoadNumber('lat')
	const lng = storageLoadNumber('lng')
	const zoom = storageLoadNumber('zoom')
	if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
		myLastLocation = latLng(lat, lng)
		myMap.setView(myLastLocation, zoom, {
			animate: false,
		})
	} else {
		myMap.fitWorld()
	}

	control.scale({
		imperial: false,
	}).addTo(myMap)

	myToolBar({
		position: 'topright',
	}).addTo(myMap)

	control.zoom({
		position: 'topright',
	}).addTo(myMap)

	myMap.on({
		locationfound: handleLocationFound,
		locationerror: handleLocationError,
		click: hideMenu,
		dblclick: handleDblClick,
	})
}

export function mapFinish() {
	if (myMap) {
		const center = myMap.getCenter()
		const zoom = myMap.getZoom()
		storageSaveNumber('lat', center.lat)
		storageSaveNumber('lng', center.lng)
		storageSaveNumber('zoom', zoom)
	}
}

/**************************************/

interface WigatorJSONMapBase {
	overlay?: true
	zIndex?: number
	headers?: string[]
}

interface WigatorJSONMapOnline extends WigatorJSONMapBase {
	pattern: string
	[other: string]: any
}

interface WigatorJSONMapOffline extends WigatorJSONMapBase {
	files: string[]
}

function createTileLayer(map: unknown): TileLayer | undefined {
	if (!map || typeof map !== 'object')
		return undefined

	const opts: { [option: string]: any } = {
		detectRetina: options.retina,
		updateWhenZooming: true,
		updateWhenIdle: false,
	}

	const online = map as WigatorJSONMapOnline
	const offline = map as WigatorJSONMapOffline

	if (options.online && typeof online.pattern === 'string') {// online
		for (const option in online)
			if (!['pattern', 'overlay'].includes(option))
				opts[option] = online[option]
		return /{qk}/.test(online.pattern)
			? tileLayerQuadKeys(online.pattern, opts as TileLayerOptions)
			: tileLayer(online.pattern, opts as TileLayerOptions)
	} else if (Array.isArray(offline.files)) {// offline
		return mapFileLayer(offline.files, opts)
	}

	return undefined
}

interface WigatorJSONMaps {
	[key: string]: WigatorJSONMapBase
}

interface WigatorJSON {
	maps?: WigatorJSONMaps
	features?: GeoJsonObject
}

export function mapLoad(wigator: WigatorJSON) {
	const baseMaps: Control.LayersObject = {}
	const overlays: Control.LayersObject = {}
	let zIndex = 0
	let baseIndex = 0

	if (typeof wigator.features === 'object') {
		const gj = geoJSON(wigator.features, {
			onEachFeature: (feature) => feature.properties.notify && notifyAdd(feature),
		}).bindPopup((layer: any) => layer && layer.feature && layer.feature.properties && layer.feature.properties.name)
		gj.setZIndex(/*wigator.features.zIndex || */++zIndex)
		overlays.GeoJSON = gj
		if (myMap)
			gj.addTo(myMap)
	}

	if (typeof wigator.maps === 'object') {
		for (const name in wigator.maps) {
			const info = wigator.maps[name]
			if (info.headers)
				continue
			const layer = createTileLayer(info)
			if (layer) {
				(info.overlay ? overlays : baseMaps)[name] = layer
				if (info.overlay)
					layer.setZIndex(info.zIndex || ++zIndex)
				else if (!baseIndex++ && myMap)
					layer.addTo(myMap)
			}
		}
	}

	if (myMap)
		control.layers(baseMaps, overlays, {
			position: 'topleft',
			hideSingleBase: true,
			autoZIndex: false,
		}).addTo(myMap)
}
