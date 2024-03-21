<script lang="ts" setup>
import { IWidget } from "@/modules/widget";
import Tree from "primevue/tree";
import { ISlot } from "@/modules/slot";

defineProps<{ modelValue: IWidget; widget: IWidget }>();

const emit = defineEmits<{
	"update:modelValue": [IWidget];
}>();

const value = (widget: IWidget) => {
	const children: any[] = [];

	widget.slots?.forEach((slot: ISlot) => {
		slot.widgets.forEach((widget: IWidget) => {
			children.push(...value(widget));
		});
	});

	return [
		{
			key: widget.id.toString(),
			label: widget.type.name || "Неизвестный",
			children,
			widget,
		},
	];
};

const onSelect = (node: any) => {
	console.log(node.widget);
	emit("update:modelValue", node.widget);
};
</script>

<template>
	<Tree
		:value="value(widget)"
		selection-mode="single"
		@node-select="onSelect"
	/>
</template>
