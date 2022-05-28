<route lang="json">
{ "meta": { "title": "Inputs", "order": 1 } }
</route>

<template>
    <div class="controls">
        <Checkbox v-model="disabled" label="Controls disabled" />
        <Checkbox v-model="disabled" :disabled="disabled" />
        <Textbox v-model="txt" label="Text" placeholder="text" :disabled="disabled" />
        <Textbox v-model="pass" type="password" label="Password" placeholder="test" :disabled="disabled" />
        <Checkbox v-model="check" label="Checkbox" :disabled="disabled" />
        <Button :disabled="disabled">I am a button</Button>
        <Select v-model="color" :options="['blue', 'red', 'green', 'fish', 'yep']" :disabled="disabled" />
        <Options v-model="option" label="Options" :disabled="disabled">
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
            <Option value="option3">Option 3</Option>
        </Options>
        <Range />
    </div>
    Tooltipped:
    <div class="controls">
        <Checkbox v-model="disabled" label="Controls disabled" tooltip="test" />
        <Checkbox v-model="disabled" :disabled="disabled" tooltip="test" />
        <Textbox v-model="txt" label="Text" placeholder="text" :disabled="disabled" tooltip="test" />
        <Textbox v-model="pass" type="password" label="Password" placeholder="test" :disabled="disabled" tooltip="test" />
        <Checkbox v-model="check" label="Checkbox" :disabled="disabled" tooltip="test" />
        <Button :disabled="disabled" tooltip="test">I am a button</Button>
        <Select v-model="color" :options="['blue', 'red', 'green', 'fish', 'yep']" :disabled="disabled" tooltip="test" />
        <Options v-model="option" label="Options" :disabled="disabled" tooltip="test">
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
            <Option value="option3">Option 3</Option>
        </Options>
        <Range />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import Button from "@/components/inputs/Button.vue";
import Checkbox from "@/components/inputs/Checkbox.vue";
import Option from "@/components/inputs/Option.vue";
import Options from "@/components/inputs/Options.vue";
import Range from "@/components/inputs/Range.vue";
import Select from "@/components/inputs/Select.vue";
import Textbox from "@/components/inputs/Textbox.vue";

const pass = ref("fish");
const color = ref("red");
const disabled = ref(false);
const txt = ref("");
const check = ref(true);
const option = ref(["option1"]);
</script>

<style lang="scss" scoped>
.controls {
    //position: relative;
    display: grid;
    grid-template-columns: 400px 400px;
    gap: 10px;
}
</style>
