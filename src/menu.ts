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

import { IPanelState, hidePanel, showPanel } from './panel'
import { options } from './options'

/**************************************/

const MENU_CONTAINER = 'wigator-menu-container'
let menuVisible = false
const menuState: IPanelState = {}

export function hideMenu() {
	hidePanel(MENU_CONTAINER, menuState)
	menuVisible = false
}

function showMenu() {
	showPanel(MENU_CONTAINER, menuState)
	menuVisible = true
}

export function toggleMenu() {
	if (menuVisible)
		hideMenu()
	else
		showMenu()
}

/**************************************/

function registerBoolCtrl(id: string) {
	interface IBoolOptions {
		[name: string]: boolean
	}

	const elem = document.getElementById('wigator-opt-' + id) as HTMLInputElement
	if (elem) {
		elem.checked = (options as IBoolOptions)[id]
		elem.addEventListener('change', () => ((options as IBoolOptions)[id] = elem.checked))
	}
}

export function menuStart() {
	['retina', 'online'].forEach(registerBoolCtrl)
}

/**************************************/
