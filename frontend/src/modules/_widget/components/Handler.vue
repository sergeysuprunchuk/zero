<script lang="ts" setup>
import Props from "./Props.vue";
import { IHandler } from "../types/handler";
import { FormKit } from "@formkit/vue";
import { handlers } from "../data/handlers";

defineProps<{ modelValue: IHandler; namespace: string[] }>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
	<FormKit
		type="primedropdown"
		placeholder="имя обработчика"
		:options="handlers"
		option-label="name"
		:model-value="modelValue"
		@update:model-value="emit('update:modelValue', $event)"
	/>

	<Props
		v-if="modelValue.scheme"
		:id="20"
		:scheme="modelValue.scheme"
		:namespace="namespace"
		v-model="modelValue.props"
	/>
</template>
