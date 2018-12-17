# TutorialPaths - dt
The 'dt' repository stores the main files for the TutorialPaths webpages. This repository is cloned to [dom.tutorialpaths.com](https://dom.tutorialpaths.com), and the application in [tutorialpaths.com](https://tutorialpaths.com) will fetch the files from that domain when required.

## File Compiling
The style.scss and script.js files are compiled by webpack locally on a device, and result as follows:

PATH/style.scss -> PATH/bundle.css

PATH/script.js -> PATH.bundle.js

The index.html files are renamed to \_index.html, so that visiting the url on the [dom.tutorialpaths.com](https://dom.tutorialpaths.com) domain will not show a very broken webpage.
