# This file is part of Wigator.
#
# Copyright (c) 2018, 2020, 2021 Aleksander Mazur
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

.PHONY:	all tsc build lint stylelint

all:	tsc lint stylelint build after

node_modules:
	time npm install

after:
	./bundle.sh output < src/index.html > output/wigator.html

output/intermediate/index.css:	src/index.css
	cp -v $? $@

stylelint:
	time npm run stylelint

lint:
	time npm run lint

tsc:
	time npm run tsc

build:	output/intermediate/index.css
	time npm run build
