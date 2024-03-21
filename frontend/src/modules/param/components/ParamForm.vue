<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { IParam } from "../types/param";
import { ISchema } from "../types/schema";
import { IContext } from "@/modules/context";
import { onMounted, ref, watch } from "vue";
import ParamField from "./ParamField.vue";
import _ from "lodash";

const props = withDefaults(
	defineProps<{
		modelValue: Nullable<IParam[]>;
		schemas: ISchema[];
		ctx: IContext;
		title?: string;
	}>(),
	{ title: "Параметры" },
);

const emit = defineEmits<{
	"update:modelValue": [IParam[]];
}>();

const formData = ref<{ [key: string]: Nullable<IParam> }>({});

onMounted(() => {
	if (props.modelValue) {
		const newFormData: { [key: string]: Nullable<IParam> } = {};

		props.modelValue.forEach((param: IParam) => {
			newFormData[param.name] = param;
		});

		formData.value = newFormData;
	}
});

watch(
	() => props.modelValue,
	() => {
		if (props.modelValue) {
			const newFormData: { [key: string]: Nullable<IParam> } = {};

			props.modelValue.forEach((param: IParam) => {
				newFormData[param.name] = param;
			});

			formData.value = newFormData;
		}
	},
);

const onUpdate = _.debounce((): void => {
	const newModelValue: IParam[] = [];

	_.keys(formData.value).forEach((key: string) => {
		if (formData.value[key]) {
			newModelValue.push(<IParam>formData.value[key]);
		}
	});

	emit("update:modelValue", newModelValue);
}, 1_000);
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<ParamField
			v-for="schema in schemas"
			:key="schema.binds.name"
			:schema="schema"
			:ctx="ctx"
			v-model="formData[schema.binds.name]"
			@update:model-value="onUpdate"
		/>
	</form>
</template>
