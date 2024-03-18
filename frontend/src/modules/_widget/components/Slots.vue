<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import Button from "primevue/button";
import { ref } from "vue";
import { ISlot } from "../types/slot";
import { creator } from "../utils/creator";

const props = defineProps<{
	modelValue: ISlot[] | undefined;
	slots: string[];
}>();

const emit = defineEmits(["update:modelValue", "add"]);

const selectedSlot = ref<string | null>(null);

const addSlot = () => {
	const widget = creator.widget();
	setTimeout(() => {
		emit("add", widget.id);
	});

	if (props.modelValue) {
		const index = props.modelValue.findIndex(
			(value) => value.name === selectedSlot.value,
		);

		if (index !== -1) {
			emit("update:modelValue", [
				...props.modelValue.slice(0, index),
				{
					...props.modelValue[index],
					widgets: [...props.modelValue[index].widgets, widget],
				},
				...props.modelValue.slice(index + 1),
			]);
			return;
		}

		emit("update:modelValue", [
			...props.modelValue,
			{
				name: selectedSlot.value,
				widgets: [widget],
			},
		]);
		return;
	}

	emit("update:modelValue", [
		{
			name: selectedSlot.value,
			widgets: [widget],
		},
	]);
};
</script>

<template>
	<FormKit
		type="primedropdown"
		:options="slots"
		v-model="selectedSlot"
		placeholder="Слоты виджета"
	/>
	<Button
		:disabled="!selectedSlot"
		label="Добавить слот"
		@click="addSlot(), (selectedSlot = null)"
	/>
</template>
