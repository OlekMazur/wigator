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

function isFullscreen(): boolean {
	const doc: any = document
	for (const f of ['fullscreenElement', 'webkitFullscreenElement', 'msFullscreenElement', 'mozFullScreenElement'])
		if (doc[f])
			return true
	return false
}

function enterFullscreen() {
	const body: any = document.body
	for (const f of ['requestFullscreen', 'webkitRequestFullscreen', 'msRequestFullscreen', 'mozRequestFullScreen'])
		if (body[f]) {
			body[f]()
			break
		}
}

function exitFullscreen() {
	const doc: any = document
	for (const f of ['exitFullscreen', 'webkitExitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen'])
		if (doc[f]) {
			doc[f]()
			break
		}
}

export function toggleFullscreen() {
	if (isFullscreen())
		exitFullscreen()
	else
		enterFullscreen()
}
