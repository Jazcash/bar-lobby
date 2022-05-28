<template>
    <div class="control options" :class="{ disabled, fullWidth }">
        <label v-if="label">
            {{ label }}
        </label>
        <div class="list">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { provide, ref } from "vue";

const props = withDefaults(
    defineProps<{
        modelValue: unknown;
        label?: string;
        required?: boolean;
        disabled?: boolean;
        fullWidth?: boolean;
    }>(),
    {
        label: undefined,
        required: false,
        disabled: false,
        fullWidth: false,
    }
);

const emits = defineEmits<{
    (event: "update:modelValue", value: unknown): void;
}>();

const selectedOption = ref(props.modelValue);

provide("selectedOption", selectedOption);

provide("toggleOption", (optionValue: unknown) => {
    if (Array.isArray(selectedOption.value)) {
        if (selectedOption.value.includes(optionValue)) {
            if (!props.required || (props.required && selectedOption.value.length > 1)) {
                selectedOption.value = selectedOption.value.filter((v) => v !== optionValue);
            }
        } else {
            selectedOption.value.push(optionValue);
        }
    } else {
        if (!props.required && selectedOption.value === optionValue) {
            selectedOption.value = null;
        } else {
            selectedOption.value = optionValue;
        }
    }

    emits("update:modelValue", selectedOption.value);
});
</script>

<style lang="scss" scoped>
.options {
    display: inline-flex;
    align-self: flex-start;
    overflow: hidden;
    &.fullWidth {
        align-self: unset;
        :deep(.option) {
            width: 100%;
        }
    }
    &.top-label {
        flex-direction: column;
        label {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
    }
    label {
        padding: 3px 7px;
        justify-content: center;
        align-items: center;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        flex-grow: 1;
    }
    .list {
        display: inline-flex;
        justify-self: flex-start;
        flex-direction: row;
    }
}
</style>
