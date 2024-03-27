<script lang="ts" setup>
import { computed, inject, onBeforeMount, useSlots } from "vue";
import { GridStack } from "gridstack";
import _ from "lodash";

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
		grid = GridStack.init({
			float: true,
			cellHeight: "initial",
		});
		grid
			.on("dragstop", (event) => {
				const newGrids = {};
				grid.save(true).forEach((item) => {
					newGrids[item.id] = item;
				});
				setGrids(newGrids);
			})
			.on(
				"resize",
				_.debounce((event) => {
					const newGrids = {};
					grid.save(true).forEach((item) => {
						newGrids[item.id] = item;
					});
					setGrids(newGrids);
				}, 500),
			);
	});
});

const attrs = (key: number) => {
	const grid = grids(key);
	if (!grid) {
		return {};
	}
	return {
		"gs-id": key,
		"gs-w": grid.w,
		"gs-h": grid.h,
		"gs-x": grid.x,
		"gs-y": grid.y,
	};
};
</script>

<template>
	<div
		class="grid-stack"
		:style="{ width: '100%', height: '100%' }"
	>
		<div
			v-for="item in items"
			class="grid-stack-item"
			:gs-id="item.key"
			v-bind="attrs(item.key)"
		>
			<div class="grid-stack-item-content">
				<component :is="item" />
			</div>
		</div>
	</div>
</template>
