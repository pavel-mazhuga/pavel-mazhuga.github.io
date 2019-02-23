# Webpack Boilerplate

## Требование:
* Node.js версии 8 или выше (https://nodejs.org/en/)
* С нодой автоматически ставится пакетный менеджер - NPM (Node Package Manager) (https://www.npmjs.com/)

## В сборку включены:
* jQuery последней версии (https://jquery.com/)
* Bootstrap 4 (https://getbootstrap.com/)
* Barba.js — библиотека для PJAX переходов между страницами (http://barbajs.org/)
    - src/js/views => здесь лежат вьюхи страниц сайта
    - src/js/transitions => здесь лежат транзишены между вьюхами

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
* **npm run nocache** — очистка кеша ./node_modules/.cache/, иногда нужно для imagemin.
* **npm start** — сервер в development-режиме
* **npm run prod** — сборка в production-режиме (publicPath === "/")
* **npm run prod:sandbox** — сборка в production-режиме (publicPath === "/sand/{project-name}/dev/" - для деплоя на sandbox-сервер Chipsa)
* **npm run prod:bitrix** — сборка в production-режиме (publicPath === "[путь от корня до папки со фронтендом]")
* **npm run build** — релизный билд, запускается в production-режиме, включая все линтеры
