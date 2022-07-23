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

export interface IPanelState {
	timer?: number
}

function panelStateClearTimer(state: IPanelState) {
	if (state.timer !== undefined) {
		window.clearTimeout(state.timer)
		state.timer = undefined
	}
}

export function hidePanel(id: string, state: IPanelState): void {
	panelStateClearTimer(state)
	const div = document.getElementById(id)
	if (div) {
		div.classList.add('fade-out')
		state.timer = window.setTimeout(() => {
			state.timer = undefined
			div.classList.add('hidden')
		}, 222)
	}
}

export function showPanel(id: string, state: IPanelState): void {
	panelStateClearTimer(state)
	const div = document.getElementById(id)
	if (div) {
		div.classList.remove('hidden', 'fade-out')
	}
}
