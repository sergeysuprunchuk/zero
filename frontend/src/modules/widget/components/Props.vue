<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { IProp } from "../types/prop";
import { caster } from "../utils/caster";

const props = defineProps<{
	scheme: { name: string; type: string; [key: string]: unknown }[];
	modelValue: IProp[] | undefined;
}>();

const emit = defineEmits(["update:modelValue"]);

const setProp = (name: string, value: unknown) => {
	if (props.modelValue) {
		const index = props.modelValue.findIndex(
			(value: IProp) => value.name === name,
		);

		if (index !== -1) {
			emit("update:modelValue", [
				...props.modelValue.slice(0, index),
				{
					...props.modelValue[index],
					value: caster.toString(value),
				},
				...props.modelValue.slice(index + 1),
			]);
			return;
		}

		emit("update:modelValue", [
			...props.modelValue,
			{
				name,
				type: typeof value,
				value: caster.toString(value),
			},
		]);
		return;
	}

	emit("update:modelValue", [
		{
			name,
			type: typeof value,
			value: caster.toString(value),
		},
	]);
};

const getProp = (name: string) => {
	const value = props.modelValue?.find((value) => value.name === name);

	return value ? caster.toValue(value.type, value.value) : null;
};
</script>

<template>
	<FormKit
		v-for="item in scheme"
		:key="item.name"
		v-bind="item"
		:model-value="getProp(item.name)"
		@update:model-value="(value: unknown) => setProp(item.name, value)"
	/>
</template>
