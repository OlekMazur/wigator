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

import { LatLng } from 'leaflet'

/** Formats a number in a human-readable way. */
export function formatNumber(val: number) {
	return Math.round(val * 10) / 10
}

/** Formats coordinate (lat or lng) in a human-readable way. */
function formatLatOrLng(val: number, dirs: string) {
	const minus = val < 0 ? 1 : 0
	if (val < 0)
		val = -val
	return val.toFixed(7) + '&deg;' + dirs[minus]
}

/** Formats coordinates in a human-readable way. */
export function formatLatLng(latlng: LatLng, joinWith: string) {
	return formatLatOrLng(latlng.lat, 'NS') + joinWith + formatLatOrLng(latlng.lng, 'EW')
}

function formatNumberLeadingZeros(x: number, len: number): string {
	let s = x.toString()
	while (s.length < len)
		s = '0' + s
	return s
}

function formatTime(dt: Date): string {
	let result = formatNumberLeadingZeros(dt.getHours(), 2)
		+ ':' + formatNumberLeadingZeros(dt.getMinutes(), 2)
		+ ':' + formatNumberLeadingZeros(dt.getSeconds(), 2)
	const frac = dt.getMilliseconds()
	if (frac)
		result += '.' + formatNumberLeadingZeros(Math.round(frac / 10), 2)
	const now = new Date()
	if (now.getFullYear() != dt.getFullYear() || now.getMonth() != dt.getMonth() || now.getDate() != dt.getDate())
		result = dt.getFullYear()
		+ ':' + formatNumberLeadingZeros(dt.getMonth() + 1, 2)
		+ ':' + formatNumberLeadingZeros(dt.getDate(), 2)
		+ '<br>' + result
	return result
}

export function formatTS(ts: number): string {
	return ts ? formatTime(new Date(ts)) : ''
}
