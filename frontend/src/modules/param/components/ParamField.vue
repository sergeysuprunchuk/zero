<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { IParam } from "../types/param";
import { ISchema } from "../types/schema";
import { VariableDropdown, IContext } from "@/modules/context";
import { FormKit } from "@formkit/vue";
import { computed, ref } from "vue";

const props = defineProps<{
	modelValue: Nullable<IParam>;
	schema: ISchema;
	ctx: IContext;
}>();

const emit = defineEmits<{
	"update:modelValue": [Nullable<IParam>];
}>();

const isVar = ref<boolean>(false);

const onUpdate = (value: unknown): void => {
	if (props.schema.set && !isVar.value) {
		try {
			value = props.schema.set(value);
		} catch {
			return;
		}
	}

	emit("update:modelValue", {
		isVar: isVar.value,
		name: props.schema.binds.name,
		type: typeof value,
		value,
	});
};

const getValue = computed<unknown>(() => {
	if (!props.modelValue) {
		return null;
	}

	if (props.schema.get && !isVar.value) {
		try {
			return props.schema.get(props.modelValue.value);
		} catch {
			return null;
		}
	}

	return props.modelValue.value;
});
</script>

<template>
	<div class="flex flex-col gap-y-1 w-full">
		<VariableDropdown
			v-if="isVar"
			:ctx="ctx"
			:model-value="getValue ? <string>getValue : null"
			@update:model-value="onUpdate"
		/>
		<FormKit
			v-else
			v-bind="schema.binds"
			:model-value="getValue"
			@update:model-value="onUpdate"
		/>
		<FormKit
			type="primecheckbox"
			binary
			v-model="isVar"
			@update:model-value="emit('update:modelValue', null)"
		/>
	</div>
</template>