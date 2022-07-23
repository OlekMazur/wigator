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

import 'core-js/stable'
import 'normalize.css'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { optionsLoad, optionsSave } from './options'
import { mapStart, mapLoad, mapLocate, mapFinish } from './map'
import { menuStart } from './menu'
import { hideAlert } from './alert'
import configuration from './configuration'

document.body.onload = function() {
	optionsLoad()
	menuStart()
	mapStart('wigator-map')
	mapLocate()

	fetch('wigator.json')
	.then((result) => result.json())
	.catch(() => configuration)
	.then(mapLoad)

	hideAlert()
}

window.addEventListener('unload', () => {
	optionsSave()
	mapFinish()
})
