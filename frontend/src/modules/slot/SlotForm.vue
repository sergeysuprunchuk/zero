<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { ISlot } from "./types";
import { FormKit } from "@formkit/vue";
import Button from "primevue/button";
import { IWidget, nullWidget } from "@/modules/widget";
import { ref } from "vue";
import _ from "lodash";

const props = withDefaults(
	defineProps<{
		modelValue: Nullable<ISlot[]>;
		slotNames: string[];
		title?: string;
	}>(),
	{ title: "Параметры" },
);

const emit = defineEmits<{
	"update:modelValue": [ISlot[]];
	"added": [IWidget];
}>();

const slotName = ref<string | null>(null);

const onClick = (): void => {
	if (!slotName.value) return;

	const newWidget = nullWidget();

	if (!props.modelValue) {
		emit("update:modelValue", [{ name: slotName.value, widgets: [newWidget] }]);
		emit("added", newWidget);
		return;
	}

	const index: number = props.modelValue.findIndex(
		(value: ISlot) => value.name === slotName.value,
	);

	if (index !== -1) {
		emit("update:modelValue", [
			..._.slice(props.modelValue, 0, index),
			{
				name: props.modelValue[index].name,
				widgets: [...props.modelValue[index].widgets, newWidget],
			},
			..._.slice(props.modelValue, index + 1),
		]);
		emit("added", newWidget);
		return;
	}

	emit("update:modelValue", [
		...props.modelValue,
		{ name: slotName.value, widgets: [newWidget] },
	]);
	emit("added", newWidget);
};
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<FormKit
			type="primedropdown"
			placeholder="Имена слотов"
			:options="slotNames"
			v-model="slotName"
		/>
		<Button
			label="Добавить"
			@click="onClick(), (slotName = null)"
		/>
	</form>
</template>
