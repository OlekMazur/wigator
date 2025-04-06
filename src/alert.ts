/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2020, 2024 Aleksander Mazur
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

import { IPanelState, showPanel, hidePanel } from './panel'

const ALERT_ELEMENT = 'wigator-alert'
const ALERT_CONTAINER = ALERT_ELEMENT + '-container'
const alertState: IPanelState = {}

export function showAlert() {
	showPanel(ALERT_CONTAINER, alertState)
}

export function hideAlert() {
	hidePanel(ALERT_CONTAINER, alertState)
}

export function startAlert(content?: string): HTMLElement | null {
	const div = document.getElementById(ALERT_ELEMENT)
	if (div && content !== undefined) {
		div.innerHTML = content
	}
	return div
}
