<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { IContext } from "./types";
import { variables } from "./utils";
import { FormKit } from "@formkit/vue";
import _ from "lodash";

defineProps<{ modelValue: Nullable<string>; ctx: IContext }>();

const emit = defineEmits<{
	"update:modelValue": [string];
}>();
</script>

<template>
	<FormKit
		type="primedropdown"
		placeholder="Переменные"
		:options="_.keys(variables(ctx))"
		:model-value="modelValue"
		@update:model-value="emit('update:modelValue', $event)"
	/>
</template>
