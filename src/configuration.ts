/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2022 Aleksander Mazur
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

const configuration = {
	maps: {
		'OpenStreetMap - humanitarna': {
			'pattern': 'http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png'
		},
		'OpenStreetMap.fr': {
			'pattern': 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
		},
		'OpenStreetMap.de': {
			'pattern': 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png'
		},
		'OpenStreetMap': {
			'pattern': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		},
		'OpenTopoMap': {
			'pattern': 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			'maxZoom': 17
		},
		'Stamen Toner': {
			'pattern': 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'
		},
		'Stamen Toner (background)': {
			'pattern': 'http://tile.stamen.com/toner-background/{z}/{x}/{y}.png'
		},
		'Stamen Terrain': {
			'pattern': 'http://tile.stamen.com/terrain/{z}/{x}/{y}.png'
		},
		'Stamen Watercolor': {
			'pattern': 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
		},
		'amap.com': {
			'pattern': 'http://webrd0{s}.is.autonavi.com/appmaptile?lang={lang}&size={size}&scale={scale}&style={style}&x={x}&y={y}&z={z}',
			'subdomains': '1234',
			'lang': 'en',
			'size': '1',
			'scale': '1',
			'style': '8'
		}
	},
	'features': {
		'type': 'FeatureCollection',
		'features': [
			{
				'type': 'Feature',
				'geometry': {
					'type': 'Point',
					'coordinates': [9.1957, 45.4649]
				},
				'properties': {
					'name': 'Gino Sorbillo'
				}
			}
		]
	}
}

export default configuration
