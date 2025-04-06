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

/**************************************/

const STORAGE_PREFIX = 'wigator:'

/**************************************/

export function storageLoadStr(name: string, defaultValue = ''): string {
	try {
		const value = window.localStorage.getItem(STORAGE_PREFIX + name)
		if (typeof value === 'string')
			return value
	} catch (_e) {
	}
	return defaultValue
}

export function storageSaveStr(name: string, value: string): void {
	try {
		window.localStorage.setItem(STORAGE_PREFIX + name, value)
	} catch (_e) {
	}
}

export function storageLoadNumber(name: string, defaultValue = NaN): number {
	const valueStr = storageLoadStr(name)
	const valueInt = valueStr ? parseFloat(valueStr) : NaN
	return isNaN(valueInt) ? defaultValue : valueInt
}

export function storageSaveNumber(name: string, value: number): void {
	storageSaveStr(name, value.toString())
}

export function storageLoadBool(name: string, defaultValue = false): boolean {
	const valueInt = storageLoadNumber(name)
	return isNaN(valueInt) ? defaultValue : !!valueInt
}

export function storageSaveBool(name: string, value: boolean): void {
	storageSaveStr(name, value ? '1' : '0')
}

export function storageDelete(name: string): void {
	try {
		window.localStorage.removeItem(STORAGE_PREFIX + name)
	} catch (_e) {
	}
}

/**************************************/
