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

/**************************************/

const PREFIX = 'wigator-sound-'

function getOrCreateSound(sound: string, play: boolean): HTMLAudioElement {
	const id = PREFIX + sound
	let elem: HTMLAudioElement = document.getElementById(id) as HTMLAudioElement

	if (!elem && play) {
		elem = document.createElement('audio')
		elem.id = id
		elem.src = sound
		document.body.appendChild(elem)
	}

	return elem
}

/**************************************/

export function playSound(sound: string, loop = false): boolean {
	const elem = getOrCreateSound(sound, true)
	if (elem) {
		elem.loop = loop
		// tslint:disable-next-line:no-try-promise
		try {
			elem.play()
			return true
		} catch (e) {
		}
	}
	return false
}

export function stopSound(sound: string): boolean {
	const elem = getOrCreateSound(sound, false)
	if (elem) {
		elem.pause()
		elem.currentTime = 0
		return true
	}
	return false
}
