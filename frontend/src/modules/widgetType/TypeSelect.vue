<script lang="ts" setup>
import { IWidgetType } from "./types";
import { Nullable } from "primevue/ts-helpers";
import Button from "primevue/button";
import { config } from "./config";

withDefaults(
	defineProps<{
		widgetTypes?: IWidgetType[];
		modelValue: Nullable<IWidgetType>;
		title?: string;
	}>(),
	{ title: "Тип виджета", widgetTypes: () => config },
);

const emit = defineEmits<{
	"update:modelValue": [IWidgetType];
}>();
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<div class="w-full h-full grid grid-cols-2 gap-x-6 gap-y-3">
			<Button
				v-for="widgetType in widgetTypes"
				:key="widgetType.name"
				class="uppercase"
				@click="emit('update:modelValue', { ...widgetType, component: null })"
				:label="widgetType.name"
				:outlined="widgetType.name !== modelValue?.name"
			/>
		</div>
	</form>
</template>
