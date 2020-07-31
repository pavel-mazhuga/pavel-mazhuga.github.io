# Webpack Boilerplate

## Требования

-   [Node.js](https://nodejs.org/en/) версии 12 или выше. С нодой автоматически ставится пакетный менеджер - [NPM](https://www.npmjs.com/). Проверить версию ноды можно командой **node -v**.
-   Для сабсеттинга шрифтов (необязательно):
    -   [Python](https://www.python.org/)
    -   [Fonttools](https://github.com/fonttools/fonttools): **pip install fonttools**
    -   Brotli: **pip install brotli**

## Как начать работу

1. Создайте новый проект на гитлабе: https://gitlab.com/projects/new.
2. Склонируйте данный репозиторий на ваше локальное окружение: `git@gitlab.com:chipsadesign/webpack-boilerplate.git`, затем перейдите в созданную директорию.
3. Поменяйте remote url на url нового репозитория: **git remote set-url origin [new_url_here]**.
4. Установите npm-зависимости: `npm i`.
5. Запустите команду `npm run watch`.

Если произошла ошибка - не пугаемся, смотрим на ошибку, выясняем, в чем проблема, гуглим решение или спрашиваем у коллег.

## В сборку включены:

-   [Bootstrap 4](https://getbootstrap.com/)
-   [Vue.js](https://vuejs.org/)
-   [Typescript](https://www.typescriptlang.org/) через [babel-plugin](https://babeljs.io/docs/en/babel-preset-typescript). TS используется исключительно как тулза для возможности типизировать код, наличие ошибок TS не сломает сборку (разработчик несет ответственность за возможные ошибки в рантайме).

Список всех npm-пакетов можно посмотреть в файле **package.json**.

## Базовая конфигурация через app.config.js

-   **LANGUAGE** - язык сайта, запишется в `<html>` lang-атрибут.
-   **TITLE** - тайтл, запишется в тег `<title>` в `<head>`.
-   **DESCRIPTION** - дескришпн, запишется в тег `<meta content="description">`, а также в соответствующие og-метатеги.
-   **THEME_COLOR** - цвет темы сайта (нужно для Progressive Web App).
-   **BACKGROUND_COLOR** - цвет фона сайта (нужно для Progressive Web App).
-   **USE_HTML** - нужно ли генерировать HTML. Если верстаем сразу в php, ставим этот флаг в "false".
-   **HTML_PRETTY** - человекопонятное форматирование сгенерированного вебпаком HTML-файлов.
-   **USE_FAVICONS** - нужно ли генерировать множество иконок для разных платформ (нужно для Progressive Web App).
-   **USE_COMPRESSION** - нужно ли сжимать ассеты с помощью алгоритмов gzip, brotli, zopfli в процессе сборки.
-   **USE_SERVICE_WORKER** - нужно ли генерировать service worker.
-   **SENTRY_DSN** - заполняем DSN-идентификатором, если подключаем sentry.
-   **PUBLIC_PATH** - публичный абсолютный путь от корня сайта до папки с фронтендом. По умолчанию "/".
-   **PUBLIC_PATH_BITRIX** - публичный абсолютный путь от корня сайта до папки с фронтендом. Для bitrix-сборки.
-   **PUBLIC_PATH_SANDBOX** - публичный абсолютный путь от корня сайта до папки с фронтендом. Для sandbox-сборки.
-   **SRC_PATH** - путь до исходников.
-   **BUILD_PATH** - путь до билда.

## Обзор комманд:

-   `npm run watch` — watch в development-режиме;
-   `npm run build` — сборка в production-режиме (publicPath === "/");
-   `npm run build:sandbox` — сборка в production-режиме (publicPath === "/sand/{project-name}/" - для деплоя на sandbox-сервер Chipsa);
-   `npm run build:bitrix` — сборка в production-режиме (publicPath === "[путь от корня до папки с фронтендом]");
-   `npm test` — запуск тестов;
-   `npm run lint:js` — запуск линтера js;
-   `npm run lint` — запуск всех линтеров (для проверки корректности файлов перед тем, как отдать бэкендеру);
-   `npm run ba` - анализ результирующего js-бандла. См. (webpack-bundle-analyzer)[https://github.com/webpack-contrib/webpack-bundle-analyzer].
-   `npm run subsetting` — сабсеттинг шрифтов (удаляются неиспользуемые глифы, значительно уменьшается размер шрифта);
-   `npx browserslist` — список поддерживаемых браузеров.

## Структура frontend-приложения

### HTML

В качестве template engine используется [Nunjucks](https://mozilla.github.io/nunjucks/). Чтобы создать страницу, просто создайте файл с расширением `.html` внутри папки `src` (можно вкладывать в поддиректории, тогда URL страницы будет соответствующим).

### CSS

Используется препроцессор [SCSS](https://sass-scss.ru/). Директория CSS - `src/css`.
Точка входа - **app.scss**.

### JS

Директория JS - `src/js`.

-   **app.ts** - точка входа в приложение.
-   **custom-elements.ts** - регистрация vue-компонентов в качестве веб-компонентов.
-   **global.d.ts** - глобальные (модульные) типы.
-   **types.ts** - типы.
-   **polyfills.ts** - полифиллы.
-   **sentry.ts** - инициализация (Sentry)[https://sentry.io/] для проекта.
-   **sw.ts** - инициализация сервис-воркера для проекта.
-   **webpack-imports.ts** - сюда подключается все, что не является непосредственно js-кодом приложения, но должно обработаться вебпаком.

Поддиректории:

-   **components** - здесь хранятся js-компоненты, например vue-компоненты, классы или фабричные функции (factory functions).
-   **service-worker** - код сервис-воркера. Используется (Workbox)[https://developers.google.com/web/tools/workbox].
-   **utils** - js-утилиты.
-   **workers** - веб-воркеры. Файлы с именем `[name].worker.ts` (или `.js`) при их импорте куда-либо в приложение с помощью [comlink-loader](https://github.com/GoogleChromeLabs/comlink-loader) преобразуются вебпаком в веб-воркеры и будут запущены браузером в отдельном потоке.

## Тесты

Work in progress

## Полезные npm-пакеты:

-   [Barba.js](https://barba.js.org/) - SPA-like PJAX navigation.
-   [Preact](https://preactjs.com/) - 3kb альтернатива React с аналогичным API.
-   [validator](https://www.npmjs.com/package/validator) - полезный модульный пакет для валидации строк.
-   [GSAP](https://greensock.com/gsap) - одна из лучших библиотек анимаций.
-   [Pixi.js](http://www.pixijs.com/) - одна из лучших библиотек для работы с 2D WebGL.
-   [Three.js](https://threejs.org/) - одна из лучших библиотек для работы с 3D WebGL.
