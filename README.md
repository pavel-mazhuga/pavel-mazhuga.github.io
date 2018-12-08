# Webpack Typescript Boilerplate

## Требование:
* Node.js версии 8 или выше
* [ImageMagick](https://www.imagemagick.org/) или [GraphicsMagick](http://www.graphicsmagick.org/)

## Обзор комманд:
* **npm run browserslist** -- список поддерживаемых браузеров
* **npm run dev** -- сборка в development-режиме и debug=off, самый быстрый способ
* **npm run debug** -- сборка в development-режиме и debug=on, медленный способ
* **npm run prod** -- сборка в production-режиме и debug=off, самый медленный способ
* **npm run watch** -- watch в production-режимеи debug=off, самый медленный способ
* **npm run watch-dev** -- watch в development-режиме и debug=off, самый быстрый способ
* **npm run watch-debug** -- watch в development-режиме и debug=on, медленный способ
* **npm run watch-prod** -- watch в production-режиме и debug=off, самый медленный способ
* **npm run js-lint** -- линтер js, часть проблем autofix
* **npm run css-lint** -- линтер css, часть проблем autofix
* **npm run css-format** -- форматер css, используется в паре с **npm run css-lint**
* **npm run html-lint** -- линтер html
* **npm run lint** -- запуск всех линтеров
* **npm run nocache** -- очистка кеша ./node_modules/.cache/, иногда нужно для imagemin.
* **npm run server** -- сервер в production-режиме и debug=off, самый медленный способ
* **npm run server-dev** -- сервер в development-режиме и debug=off, самый быстрый способ
* **npm run server-debug** -- сервер в development-режиме и debug=on, медленный способ
* **npm run server-prod** -- сервер в production-режиме и debug=off, самый медленный способ
* **npm run build** -- релизный билд, запускается в production-режиме и debug=off, включая все линтеры, очень медленный способ
