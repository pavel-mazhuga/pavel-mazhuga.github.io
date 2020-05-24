<template>
    <div class="counter">
        <div>{{ title }}</div>
        <div>{{ num }}</div>
        <button @click="() => add(3)">Add</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        title: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            num: 0,
        };
    },

    methods: {
        add(amount: number = 1) {
            this.num += amount;
        },
    },
});
</script>

<style lang="scss">
.counter {
    padding: 20px;
}
</style>
