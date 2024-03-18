<script lang="ts" setup>
import { create } from "@/modules/context";
import { execute, executeAll, IHandler, ISchema } from "@/modules/handler";
import { ref, useSlots } from "vue";
import MultiForm from "@/modules/handler/components/MultiForm.vue";
import WidgetEditor from "@/modules/widgetEditor/WidgetEditor.vue";
import { IWidgetType } from "@/modules/widgetType";

const ctx = ref(
	create(null, {
		username: "helpers",
		email: "helpers@yandex.ru",
		get: async ({ name }: { [key: string]: unknown }) => {
			console.log("get", name);
			return { id: Math.random() };
		},
		set: async ({ name }: { [key: string]: unknown }) => {
			console.log("set", name);
		},
	}),
);

const handlers = ref<IHandler[]>();

const schemas: ISchema[] = [
	{
		name: "get",
		accepts: [{ binds: { name: "name", type: "primetext" } }],
		returns: ["id"],
	},
	{
		name: "set",
		accepts: [{ binds: { name: "name", type: "primetext" } }],
	},
];

const widgetTypes: IWidgetType[] = [
	{
		name: "Button",
		dataTransfer: false,
		slots: ["default"],
		emits: ["click"],
		params: [
			{ binds: { type: "primetext", name: "label", placeholder: "этикетка" } },
			{
				binds: {
					type: "primedropdown",
					name: "severity",
					placeholder: "строгость",
					options: ["danger", "info"],
				},
			},
		],
	},
	{
		name: "Chip",
		dataTransfer: false,
		slots: ["default"],
		emits: ["click"],
		params: [
			{ binds: { type: "primetext", name: "label", placeholder: "этикетка" } },
		],
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
