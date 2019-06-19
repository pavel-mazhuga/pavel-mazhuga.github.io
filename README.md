# Webpack Boilerplate

## Требование:
* Node.js версии 8 или выше (https://nodejs.org/en/). С нодой автоматически ставится пакетный менеджер - NPM (Node Package Manager) (https://www.npmjs.com/). Проверить версию ноды можно командой **node -v**.
* Глобально установленный webpack 4: **npm i -g webpack-cli**
* Для сабсеттинга шрифтов:
    - Python
    - Fonttools (https://github.com/fonttools/fonttools): **pip install fonttools**
    - Brotli: **pip install brotli**

## В сборку включены:
* jQuery последней версии (https://jquery.com/)
* Bootstrap 4 (https://getbootstrap.com/)
* Barba v2 — библиотека для PJAX переходов между страницами (http://barbajs.org/)
    - src/js/views => здесь лежат вьюхи страниц сайта
    - src/js/transitions => здесь лежат транзишены между вьюхами

Список всех npm-пакетов можно посмотреть в файле package.json.

## Базовая конфигурация через app.config.js
* LANGUAGE - язык сайта, запишется в <html> lang-атрибут.
* TITLE - тайтл, запишется в тег <title> в <head>.
* DESCRIPTION - дескришпн, запишется в тег <meta content="description">, а также в соответствующие og-метатеги.
* THEME_COLOR - цвет темы сайта (нужно для Progressive Web App).
* BACKGROUND_COLOR - цвет фона сайта (нужно для Progressive Web App).
* USE_HTML - нужно ли генерировать HTML. Если верстаем сразу в php-файле, ставим этот флаг в "false".
* HTML_PRETTY - человекопонятнон форматирование сгенерированного вебпаком HTML-файлов.
* USE_FAVICONS - нужно ли генерировать множество иконок для разных платформ (нужно для Progressive Web App).
* USE_COMPRESSION - нужно ли сжимать ассеты с помощью алгоритмов gzip, brotli, zopfli в процессе сборки.
* USE_SERVICE_WORKER - нужно ли генерировать service worker.
* SENTRY_DSN - заполняем DSN-идентификатором, если подключаем sentry.
* PUBLIC_PATH - публичный абсолютный путь от корня сайта до папки с фронтендом. По умолчанию "/".
* PUBLIC_PATH_BITRIX - публичный абсолютный путь от корня сайта до папки с фронтендом. Для bitrix-сборки.
* PUBLIC_PATH_SANDBOX - публичный абсолютный путь от корня сайта до папки с фронтендом. Для sandbox-сборки.
* SRC_PATH - путь до исходников.
* BUILD_PATH - путь до билда.

## Обзор комманд:
* **npm run browserslist** — список поддерживаемых браузеров
* **npm run dev** — сборка в development-режиме
* **npm run watch** — watch в production-режиме
* **npm run watch-dev** — watch в development-режиме
* **npm run watch-prod** — watch в production-режиме
* **npm run js-lint** — линтер js
* **npm run css-lint** — линтер css
* **npm run css-format** — форматер css, используется в паре с **npm run css-lint**
* **npm run html-lint** — линтер html
* **npm run lint** — запуск всех линтеров (для проверки корректности html/css/js перед тем, как отдать бэкендеру)
* **npm run subsetting** — сабсеттинг шрифтов (удаляются неиспользуемые глифы, значительно уменьшается размер шрифта).
* **npm start** — сервер в development-режиме
* **npm run prod** — сборка в production-режиме (publicPath === "/")
* **npm run prod:sandbox** — сборка в production-режиме (publicPath === "/sand/{project-name}/dev/" - для деплоя на sandbox-сервер Chipsa)
* **npm run prod:bitrix** — сборка в production-режиме (publicPath === "[путь от корня до папки с фронтендом]")
* **npm run build** — релизный билд, запускается в production-режиме, включая все линтеры
* **npm test** — запуск тестов (unit, e2e)

## Полезные npm-пакеты:
* Preact (https://preactjs.com/) - 3kb альтернатива React с аналогичным API.
* validator (https://www.npmjs.com/package/validator) - полезный модульный пакет для валидации строк.
* choices.js (https://www.npmjs.com/package/choices.js) - vanilla JS кастомный селект.
* GSAP (https://greensock.com/gsap) - одна из лучших библиотек анимаций.
* Pixi.js (http://www.pixijs.com/) - одна из лучших библиотек для работы с 2D WebGL.
* Three.js (https://threejs.org/) - одна из лучших библиотек для работы с 3D WebGL.
