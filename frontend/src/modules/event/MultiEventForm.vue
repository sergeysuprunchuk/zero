<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { IContext } from "@/modules/context";
import EventForm from "./EventForm.vue";
import { IEvent, IEventDescription } from "./types";
import { ISchema } from "@/modules/handler";
import { ref, onMounted, watch } from "vue";
import _ from "lodash";
import Button from "primevue/button";

const props = withDefaults(
	defineProps<{
		modelValue: Nullable<IEvent[]>;
		handlers: ISchema[];
		ctx: IContext;
		eventNames: IEventDescription[];
		title?: string;
	}>(),
	{ title: "События" },
);

const emit = defineEmits<{
	"update:modelValue": [IEvent[]];
}>();

onMounted(() => {
	if (props.modelValue) {
		const newFormData: { [key: string]: Nullable<IEvent> } = {};

		props.modelValue.forEach((param: IEvent) => {
			newFormData[param.name] = param;
		});

		formData.value = newFormData;
	}
});

watch(
	() => props.modelValue,
	() => {
		if (props.modelValue) {
			const newFormData: { [key: string]: Nullable<IEvent> } = {};

			props.modelValue.forEach((param: IEvent) => {
				newFormData[param.name] = param;
			});

			formData.value = newFormData;
		}
	},
);

const formData = ref<{ [key: string]: Nullable<IEvent> }>({});

const submit = () => {
	const newModelValue: IEvent[] = [];

	_.keys(formData.value).forEach((key: string) => {
		if (formData.value[key]) {
			newModelValue.push(<IEvent>formData.value[key]);
		}
	});

	emit("update:modelValue", newModelValue);
};
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<EventForm
			v-for="eventName in eventNames"
			:key="eventName.name"
			:ctx="ctx"
			:handlers="handlers"
			:model-value="formData[eventName.name]?.handlers ?? null"
			@update:model-value="
				formData[eventName.name] = {
					name: eventName.name,
					handlers: $event,
					hasData: eventName.hasData,
				}
			"
			:has-data="eventName.hasData ?? false"
			:event-name="eventName.name"
		/>
		<Button
			@click="submit"
			label="Сохранить"
		/>
	</form>
</template>
