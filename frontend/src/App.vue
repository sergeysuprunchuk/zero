<script lang="ts" setup>
import { create } from "@/modules/context";
import { ISchema } from "@/modules/handler";
import { ref } from "vue";
import WidgetEditor from "@/modules/widgetEditor/WidgetEditor.vue";
import { useQuery } from "@/modules/query/utils.ts";

const { get, _delete, invalidate } = useQuery();

const ctx = ref(
	create(null, {
		get: async ({ key, url }: any) => {
			return { data: await get(key, url) };
		},
		_delete: async ({ url }: any) => {
			await _delete(url);
		},
		invalidate: async ({ key }: any) => {
			await invalidate(key);
		},
	}),
);

const schemas: ISchema[] = [
	{
		name: "get",
		accepts: [
			{ binds: { name: "key", type: "primetext", placeholder: "key" } },
			{ binds: { name: "url", type: "primetext", placeholder: "url" } },
		],
		returns: ["data"],
	},
	{
		name: "_delete",
		accepts: [
			{ binds: { name: "url", type: "primetext", placeholder: "url" } },
		],
	},
	{
		name: "invalidate",
		accepts: [
			{ binds: { name: "key", type: "primetext", placeholder: "key" } },
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
