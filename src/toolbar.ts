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

import { Control, ControlOptions, DomEvent, DomUtil, Map } from 'leaflet'
import { toggleFullscreen } from './fullscreen'
import { toggleMenu } from './menu'
import { mapFollowLocation } from './map'
import { options } from './options'

const A_CLASS = 'leaflet-control-zoom-in'
//const DISABLED_CLASS = 'leaflet-disabled'
const ZOOM_EVENTS = 'zoomend zoomlevelschange'
const ARIA_LABEL = 'aria-label'

const menuText = 'M'
const menuTitle = 'Menu'
const followTitle = 'Śledź'
const followActive = '&target;'
const followInactive = '&odot;'
const fsTitle = 'Pełny ekran'
const fsText = '&square;'

class MyToolBar extends Control {
	private map?: Map
	private zoom?: HTMLElement

	public readonly onAdd = (map: Map) => {
		this.map = map
		const container = DomUtil.create('div', 'leaflet-bar')
		let link: HTMLAnchorElement
		// open main menu button
		link = DomUtil.create('a', A_CLASS, container)
		link.innerHTML = menuText
		link.href = '#'
		link.title = menuTitle
		link.setAttribute('role', 'button')
		link.setAttribute(ARIA_LABEL, menuTitle)
		DomEvent.disableClickPropagation(link)
		DomEvent.on(link, 'click', toggleMenu, this)
		// follow geolocation button
		link = DomUtil.create('a', A_CLASS, container)
		link.href = '#'
		link.title = followTitle
		link.setAttribute('role', 'button')
		link.setAttribute(ARIA_LABEL, followTitle)
		DomEvent.disableClickPropagation(link)
		DomEvent.on(link, 'click', this.handleFollowClick, this)
		this.setFollow(link, options.follow)
		// full-screen button
		link = DomUtil.create('a', A_CLASS, container)
		link.innerHTML = fsText
		link.href = '#'
		link.title = fsTitle
		link.setAttribute('role', 'button')
		link.setAttribute(ARIA_LABEL, fsTitle)
		DomEvent.disableClickPropagation(link)
		DomEvent.on(link, 'click', toggleFullscreen, this)
		// show current zoom
		link = DomUtil.create('a', A_CLASS, container)
		link.href = '#'
		link.setAttribute('role', 'button')
		DomEvent.disableClickPropagation(link)
		this.zoom = link
		this.handleZoom()
		map.on(ZOOM_EVENTS, this.handleZoom, this)
		// ready
		return container
	}

	public readonly onRemove = (map: Map) => {
		map.off(ZOOM_EVENTS, this.handleZoom, this)
	}

	private readonly handleFollowClick = (e: Event) => {
		if (e.target)
			this.setFollow(e.target as Element, !options.follow)
	}

	private readonly setFollow = (link: Element, active: boolean) => {
		link.innerHTML = active ? followActive : followInactive
		options.follow = active
		mapFollowLocation()
	}

	private readonly handleZoom = () => {
		if (this.zoom && this.map) {
			const zoom = this.map.getZoom()
			this.zoom.innerHTML = zoom.toString()
		}
	}
}

export const myToolBar = (opts?: ControlOptions) => new MyToolBar(opts)
