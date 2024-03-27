<script lang="ts" setup>
import { create, IContext } from "@/modules/context";
import { IHandler, ISchema, MultiForm } from "@/modules/handler";
import { Nullable } from "primevue/ts-helpers";

defineProps<{
	modelValue: Nullable<IHandler[]>;
	ctx: IContext;
	eventName: string;
	handlers: ISchema[];
	hasData: boolean;
}>();

const emit = defineEmits<{
	"update:modelValue": [IHandler[]];
}>();
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ eventName }}</h2>
		<MultiForm
			:ctx="hasData ? create(ctx, { event: null }) : ctx"
			:schemas="handlers"
			:model-value="modelValue"
			@update:model-value="emit('update:modelValue', $event)"
		/>
	</form>
</template>
