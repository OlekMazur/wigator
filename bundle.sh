#!/bin/sh
#
# This file is part of Wigator.
#
# Copyright (c) 2020 Aleksander Mazur
#
# Wigator is free software: you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Wigator is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Wigator. If not, see <https://www.gnu.org/licenses/>.
#
# This script replaces html-webpack-inline-source-plugin

while read line; do
	case "$line" in
		'</head>')
			f=index.min.css
			ins_l='<style>'
			ins_r='</style>'
			;;
		'</body>')
			f=index.js
			ins_l='<script>'
			ins_r='</script>'
			;;
		*)
			f=
			ins_l=
			ins_r=
			;;
	esac

	[ -n "$ins_l" ] && echo "$ins_l"
	[ -n "$f" ] && cat "$1/$f"
	[ -n "$ins_r" ] && echo "$ins_r"

	echo "$line"
done
