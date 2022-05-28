<template>
    <Control class="checkbox">
        <div class="input">
            <!-- <input :id="uuid" v-model="checked" type="checkbox" @change="$emit('update:modelValue', checked)" />
        <label :for="uuid" :class="{ checked, hasLabel: Boolean(label) }" @mouseenter="sound">
            <div class="icon" :class="{ hasLabel: Boolean(label) }">
                <Icon class="check" :icon="checkBold" height="23" />
            </div>
            <div v-if="label" class="label">{{ label }}</div>
        </label> -->
            <Icon class="check" :icon="checkBold" height="23" />
        </div>
    </Control>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import checkBold from "@iconify-icons/mdi/check-bold";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

import Control from "@/components/inputs/Control.vue";

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        type?: string;
        label?: string;
        smallLabel?: boolean;
    }>(),
    {
        modelValue: false,
        type: "text",
        label: undefined,
        smallLabel: false,
    }
);

const emits = defineEmits<{
    (event: "update:modelValue", checked: boolean): void;
}>();

const uuid = ref(uuidv4());
const label = ref(props.label);
const checked = ref(props.modelValue);

const sound = () => api.audio.getSound("button-hover").play();
</script>

<style lang="scss" scoped>
.checkbox {
    background-color: red;
    padding: 0;
}
.input {
    flex-grow: 0;
}
// .control.checkbox {
//     .checkmark {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 100%;
//         padding: 0;
//     }

//     input[type="checkbox"] {
//         display: none;
//     }
//     label {
//         display: flex;
//         position: relative;
//         gap: 15px;
//         align-self: center;
//         &.hasLabel {
//             padding-left: 5px !important;
//         }
//         &:not(.hasLabel) {
//             padding-left: 5px;
//             padding-right: 5px;
//         }
//     }
//     .icon {
//         &.hasLabel:after {
//             position: absolute;
//             content: "";
//             top: 0;
//             left: 0;
//             width: 35px;
//             border-right: 1px solid rgba(255, 255, 255, 0.1);
//             height: 100%;
//         }
//     }
//     .check {
//         visibility: hidden;
//     }
//     .checked .check {
//         visibility: visible;
//     }
// }
</style>
