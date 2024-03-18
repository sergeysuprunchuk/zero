<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { IContext } from "@/modules/context";
import { IHandler } from "../types/handler";
import { ISchema } from "../types/schema";
import { FormKit } from "@formkit/vue";
import { ref } from "vue";
import { ParamForm } from "@/modules/param";
import AliasForm from "./AliasForm.vue";

withDefaults(
	defineProps<{
		modelValue: Nullable<IHandler>;
		schemas: ISchema[];
		ctx: IContext;
		title?: string;
	}>(),
	{ title: "Обработчик" },
);

const emit = defineEmits<{
	"update:modelValue": [IHandler];
}>();

const current = ref<ISchema>();
</script>

<template>
	<form
		@submit.prevent
		class="flex flex-col gap-3 p-3 border rounded-xl bg-white"
	>
		<h2 class="text-center uppercase">{{ title }}</h2>
		<FormKit
			type="primedropdown"
			placeholder="Название"
			:options="schemas"
			option-label="name"
			v-model="current"
			@update:model-value="
				emit('update:modelValue', { name: (<ISchema>$event).name })
			"
		/>
		<template v-if="current && modelValue">
			<ParamForm
				v-if="current.accepts"
				:key="current.name"
				:ctx="ctx"
				:schemas="current.accepts"
				:model-value="modelValue.params"
				@update:model-value="
					emit('update:modelValue', { ...modelValue, params: $event })
				"
			/>
			<AliasForm
				v-if="current.returns"
				:returns="current.returns"
				:model-value="modelValue.aliases"
				@update:model-value="
					emit('update:modelValue', { ...modelValue, aliases: $event })
				"
			/>
		</template>
	</form>
</template>
