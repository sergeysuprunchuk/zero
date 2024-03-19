<script lang="ts" setup>
import { Nullable } from "primevue/ts-helpers";
import { IContext } from "./types";
import { keyTree, variables } from "./utils";
import TreeSelect from "primevue/treeselect";

defineProps<{ modelValue: Nullable<string>; ctx: IContext }>();

const emit = defineEmits<{
	"update:modelValue": [string];
}>();
</script>

<template>
	<TreeSelect
		:options="keyTree(variables(ctx))"
		@node-select="emit('update:modelValue', $event.data)"
	>
		<template #value>
			<span class="text-sm font-normal">{{ modelValue }}</span>
		</template>
	</TreeSelect>
</template>
