<script lang="ts" setup>
import { computed, inject, onBeforeMount, useSlots } from "vue";
import { GridStack } from "gridstack";

const grids = inject("grids", {});

const setGrids = inject("setGrids", () => {});

const slots = useSlots();

let grid: any;

const items = computed<any>(() => {
	if (slots && slots.default) {
		if (grid) {
			setTimeout(() => {
				grid.destroy(false);
				GridStack.init({ float: true });
			});
		}
		return slots.default()[0].children;
	}
	return [];
});

onBeforeMount(() => {
	setTimeout(() => {
		grid = GridStack.init({ float: true });
		grid.on("dragstop", function (event) {
			console.log(event);
		});
	});
});
</script>

<template>
	<div
		class="grid-stack"
		:style="{ width: '100%', height: '100%' }"
	>
		<div
			v-for="item in items"
			class="grid-stack-item"
		>
			<div
				@dragend="change"
				class="grid-stack-item-content flex items-center justify-center bg-white rounded-xl shadow-lg"
			>
				<component :is="item" />
			</div>
		</div>
	</div>
</template>
