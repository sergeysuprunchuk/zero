<script lang="ts" setup>
import { create, invert } from "@/modules/context";
import { ISchema } from "@/modules/handler";
import { ref } from "vue";
import WidgetEditor from "@/modules/widgetEditor/WidgetEditor.vue";
import { useQuery } from "@/modules/query/utils.ts";
import { add } from "@/modules/context";
import { castType } from "@/modules/param";

const { get, _delete, invalidate, _add } = useQuery();

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
		_add: async ({ url, body }: any) => {
			await _add(url, body);
		},
	}),
);

add(ctx.value, "add variable", async ({ key, type, value }: any) => {
	add(ctx.value, key, castType(type, value));
});

add(ctx.value, "invert", async ({ key }: any) => {
	invert(ctx.value, key);
});

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
		name: "_add",
		accepts: [
			{ binds: { name: "url", type: "primetext", placeholder: "url" } },
			{ binds: { name: "body", type: "primetext", placeholder: "url" } },
		],
	},
	{
		name: "invalidate",
		accepts: [
			{ binds: { name: "key", type: "primetext", placeholder: "key" } },
		],
	},
	{
		name: "add variable",
		accepts: [
			{ binds: { name: "key", type: "primetext", placeholder: "key" } },
			{ binds: { name: "type", type: "primetext", placeholder: "type" } },
			{ binds: { name: "value", type: "primetext", placeholder: "value" } },
		],
	},
	{
		name: "invert",
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
