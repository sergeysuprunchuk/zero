<script lang="ts" setup>
import { ISlotDescription } from "./types";
import { FormKit } from "@formkit/vue";
import Button from "primevue/button";
import { ref } from "vue";

withDefaults(defineProps<{ title?: string; options: ISlotDescription[] }>(), {
	title: "Слоты",
});

const emit = defineEmits<{ submit: [ISlotDescription] }>();

const slotDescription = ref<ISlotDescription | null>(null);
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<FormKit
			type="primedropdown"
			placeholder="Выберите слот"
			:options="options"
			option-label="name"
			v-model="slotDescription"
		/>
		<Button
			label="Добавить"
			:disabled="slotDescription === null"
			@click="
				emit('submit', <ISlotDescription>slotDescription),
					(slotDescription = null)
			"
		/>
	</form>
</template>
