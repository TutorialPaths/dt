# TutorialPaths - dt
The 'dt' repository stores the main files for the TutorialPaths webpages. This repository is cloned to [dom.tutorialpaths.com](https://dom.tutorialpaths.com), and the application in [tutorialpaths.com](https://tutorialpaths.com) will fetch the files from that domain when required.

## File Compiling
The style.scss and script.js files are compiled by webpack locally on a device, and result as follows:

PATH/style.scss -> PATH/bundle.css

PATH/script.js -> PATH.bundle.js

The index.html files are renamed to \_index.html, so that visiting the url on the [dom.tutorialpaths.com](https://dom.tutorialpaths.com) domain will not show a very broken webpage.

## GNU LESSER GENERAL PUBLIC LICENSE
Copyright © 2018, Lachlan Walls

This file is part of TutorialPaths.

TutorialPaths is a free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

TutorialPaths is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with TutorialPaths.  If not, see <https://www.gnu.org/licenses/>.
