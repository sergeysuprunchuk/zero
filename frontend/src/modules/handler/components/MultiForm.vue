<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { HandlerForm, IHandler, ISchema } from "@/modules/handler";
import { IContext } from "@/modules/context";
import Button from "primevue/button";
import { ref } from "vue";

withDefaults(
	defineProps<{
		modelValue: Nullable<IHandler[]>;
		schemas: ISchema[];
		ctx: IContext;
		title?: string;
	}>(),
	{ title: "Обработчики" },
);

const emit = defineEmits<{
	"update:modelValue": [IHandler[]];
}>();

const handlers = ref<Nullable<IHandler>[]>([]);
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<HandlerForm
			v-for="(_, index) in handlers"
			:ctx="ctx"
			:schemas="schemas"
			v-model="handlers[index]"
		/>
		<Button
			@click="handlers.push(null)"
			label="Добавить обработчик"
			outlined
		/>
		<Button
			@click="
				emit(
					'update:modelValue',
					<IHandler[]>handlers.filter((handler) => handler),
				)
			"
			label="Сохранить"
		/>
	</form>
</template>
