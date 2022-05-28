<route lang="json">
{ "meta": { "title": "Prime Vue", "order": 3 } }
</route>

<template>
    <div>
        <Button label="Submit" />
        <Checkbox v-model="checked" v-tooltip="'Test'" :binary="true" />
    </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import { ref } from "vue";

const checked = ref(true);
</script>

<style lang="scss" scoped></style>
