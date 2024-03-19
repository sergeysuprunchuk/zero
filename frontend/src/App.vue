<script lang="ts" setup>
import { create } from "@/modules/context";
import { ISchema } from "@/modules/handler";
import { ref } from "vue";
import WidgetEditor from "@/modules/widgetEditor/WidgetEditor.vue";

const ctx = ref(
	create(null, {
		data: {
			id: 1,
			name: "Leanne Graham",
			username: "Bret",
			email: "Sincere@april.biz",
		},
		удалить: async ({ url }: any) => {
			console.log(url);
		},
	}),
);

const schemas: ISchema[] = [
	{
		name: "удалить",
		accepts: [{ binds: { name: "url", type: "primetext" } }],
	},
];
</script>

<template>
	<div class="h-screen w-screen bg-surface-100">
		<WidgetEditor
			:ctx="ctx"
			:handlers="schemas"
		/>
	</div>
</template>
