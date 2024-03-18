<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { FormKit } from "@formkit/vue";
import { ref } from "vue";
import _ from "lodash";

withDefaults(
	defineProps<{
		modelValue: Nullable<{ [key: string]: string }>;
		returns: string[];
		title?: string;
	}>(),
	{ title: "Псевдонимы" },
);

const emit = defineEmits<{
	"update:modelValue": [{ [key: string]: string }];
}>();

const formData = ref<{ [key: string]: string }>({});

const onUpdate = (): void => {
	const newModelValue: { [key: string]: string } = {};

	_.keys(formData.value).forEach((key: string) => {
		if (formData.value[key]) {
			newModelValue[key] = formData.value[key];
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
		<FormKit
			type="primetext"
			v-for="item in returns"
			:placeholder="item"
			v-model="formData[item]"
			@update:model-value="onUpdate"
		/>
	</form>
</template>
