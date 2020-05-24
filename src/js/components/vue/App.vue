<template>
    <div>
        <x-counter title="Counter"></x-counter>
    </div>
</template>

<script lang="ts">
export default {
    components: {
        'x-counter': () => import(/* webpackChunkName: "Counter" */ './Counter.vue'),
    },

    data() {
        return {
            name: '',
        };
    },
};
</script>

<style lang="scss">
/*  */
</style>
