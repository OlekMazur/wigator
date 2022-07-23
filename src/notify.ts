/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2020 Aleksander Mazur
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

import { LatLng, GeoJSON } from 'leaflet'
import { playSound, stopSound } from './sound'

/**************************************/

interface INotifyPoint {
	coordinates: LatLng
	distance: number
	hysteresis: number
	play: string
	loop: boolean
	state: boolean
}

let coordinates: LatLng
let accuracy = NaN

/**************************************/

function notifyCheck(np: INotifyPoint)
{
	if (!coordinates)
		return

	if (!isNaN(accuracy) && accuracy > np.distance)
		return

	const distance = coordinates.distanceTo(np.coordinates)
	const state = distance <= np.distance + (np.state ? np.hysteresis : 0)
	//console.log(distance, state, np)
	if (state !== np.state && (state ? playSound : stopSound)(np.play, np.loop))
		np.state = state
}

/**************************************/

const notifyPoints: INotifyPoint[] = []

/**************************************/

export function notifyAdd(feature: any) {
	if (typeof feature === 'object' &&
		feature.type === 'Feature' &&
		typeof feature.geometry === 'object' &&
		feature.geometry.type === 'Point' &&
		Array.isArray(feature.geometry.coordinates) &&
		feature.geometry.coordinates.length === 2 &&
		typeof feature.properties.notify === 'object' &&
		typeof feature.properties.notify.distance === 'number') {

		const np: INotifyPoint = {
			coordinates: GeoJSON.coordsToLatLng(feature.geometry.coordinates),
			distance: feature.properties.notify.distance,
			hysteresis: typeof feature.properties.notify.hysteresis === 'number' ?
				feature.properties.notify.hysteresis : feature.properties.notify.distance / 10,
			play: typeof feature.properties.notify.play === 'string' ? feature.properties.notify.play : 'notify.ogg',
			loop: typeof feature.properties.notify.loop === 'boolean' ? feature.properties.notify.loop : false,
			state: false,
		}

		notifyPoints.push(np)
		//console.log('monitoring', np)
		notifyCheck(np)
	}
}

export function notifyUpdate(_coordinates: LatLng, _accuracy: number) {
	coordinates = _coordinates
	accuracy = _accuracy

	for (const np of notifyPoints)
		notifyCheck(np)
}
