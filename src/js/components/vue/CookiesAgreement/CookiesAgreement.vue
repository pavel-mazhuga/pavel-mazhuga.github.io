<template>
    <div class="cookie-banner" :class="{ 'cookie-banner--visible': visible }">
        <button
            class="cookie-banner__close"
            @click="acceptCookiesUsage"
            aria-label="Принять и закрыть"
            title="Принять и закрыть"
        >
            ОК
        </button>
        <div class="cookie-banner__text">
            Продолжая пользоваться сайтом, вы даёте
            <a
                href="#"
                class="link-underline"
                target="_blank"
                rel="noopener"
                aria-label="Согласие на автоматический сбор и анализ ваших данных"
                >Согласие</a
            >
            на автоматический сбор и анализ ваших данных, необходимых для работы сайта и его улучшения, использование
            файлов cookie.
        </div>
    </div>
</template>

<script>
import * as Cookies from 'js-cookie';

export default {
    props: {
        revealTimeout: {
            type: Number,
            default: 5000,
        },
    },

    data() {
        return {
            visible: false,
            timer: null,
        };
    },

    mounted() {
        this.timer = setTimeout(() => {
            this.visible = true;
        }, this.revealTimeout);
    },

    beforeDestroy() {
        clearTimeout(this.timer);
    },

    methods: {
        close() {
            this.visible = false;
        },

        acceptCookiesUsage() {
            Cookies.set('COOKIES_USAGE_ACCEPTED', 'true', {
                expires: Infinity,
            });
            this.close();
        },
    },
};
</script>

<style lang="scss">
@import '../../../../css/base/variables';

.cookie-banner {
    position: fixed;
    z-index: 150;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    max-width: 570px;
    background-color: #fff;
    padding: 14px;
    padding-bottom: 38px;
    text-align: center;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    transition: opacity 0.5s ease, visibility 0.5s ease;
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;

    &:not(.cookie-banner--visible) {
        opacity: 0;
        visibility: hidden;
    }

    @media screen and (max-width: 767px) {
        bottom: auto;
        left: 0;
        transform: none;
        max-width: 100%;
        padding: 20px;
        padding-top: 15px;
        border-radius: 0;
    }
}

.cookie-banner__close {
    background-color: transparent;
    border: 0;
    padding: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-left: auto;

    @mixin hover() {
        path {
            stroke: $secondary;
        }
    }

    @media screen and (max-width: 767px) {
        width: 34px;
        height: 34px;
        padding: 5px;
        position: relative;
        right: -5px;
    }

    &:focus-visible {
        @include hover();
    }

    @media (pointer: fine) {
        &:hover {
            @include hover();
        }
    }

    path {
        transition: stroke 0.2s ease;
    }
}

.cookie-banner__text {
    padding: 0 35px;

    @media screen and (max-width: 767px) {
        padding: 0;
    }
}
</style>
