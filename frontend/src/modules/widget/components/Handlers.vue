<script lang="ts" setup>
import Button from "primevue/button";
import { IHandler } from "../types/handler";
import Handler from "./Handler.vue";

defineProps<{ modelValue?: IHandler[]; namespace: string[] }>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
	<form
		@submit.prevent
		class="w-full flex flex-col gap-3"
	>
		<Handler
			v-for="(_, index) in modelValue"
			v-model="(<any>modelValue)[index]"
			:namespace="namespace"
		/>
		<Button
			label="Добавить обработчик"
			@click="
				emit('update:modelValue', [...(modelValue ?? []), { name: null }])
			"
		/>
	</form>
</template>
