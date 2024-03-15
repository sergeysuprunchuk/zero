<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { computed, ref } from "vue";
import { IWidget } from "../types/widget";
import { creator } from "../utils/creator";
import { widgetTypes } from "../data/widgetTypes";
import { ISlot } from "../types/slot";
import Props from "./Props.vue";
import Slots from "./Slots.vue";
import Tree from "primevue/tree";
import { TreeNode } from "primevue/treenode";
import Widget from "./Widget.vue";
import { context, IContext } from "../utils/context";
import Handlers from "./Handlers.vue";

const widgetTree = ref<IWidget>(creator.widget());

const currentId = ref<number>(widgetTree.value.id);

const ctx = ref<IContext>(
	context.createNoId(null, {
		email: "zin@yandex.ru",
		password: "yandex.ru",
		get: async ({ url }: { url: string }) => {
			try {
				const response = await fetch(url);
				return { data: await response.json() };
			} catch {
				return null;
			}
		},
	}),
);

const findWidget = (id: number): IWidget | null => {
	const queue: IWidget[] = [widgetTree.value];

	for (const item of queue) {
		if (item.id === id) {
			return item;
		}

		item.slots?.forEach((slot: ISlot) => {
			queue.push(...slot.widgets);
		});
	}

	return null;
};

const currentWidget = computed((): IWidget => {
	return <IWidget>findWidget(currentId.value);
});

const nodeTree = (widget: IWidget): TreeNode[] => {
	const children: any[] = [];

	widget.slots?.forEach((slot: ISlot) => {
		slot.widgets.forEach((widget) => {
			children.push(...nodeTree(widget));
		});
	});

	return [
		{
			key: widget.id.toString(),
			label: widget.type?.displayName ?? "Неизвестно",
			children,
		},
	];
};
</script>

<template>
	<div class="w-screen h-screen flex">
		<aside class="w-72 h-full p-3">
			<Tree
				:value="nodeTree(widgetTree)"
				selection-mode="single"
				@node-select="currentId = Number($event.key)"
			/>
		</aside>
		<div class="w-full h-full flex items-center justify-center">
			<Widget
				:parent-ctx="ctx"
				:widget="widgetTree"
			/>
		</div>
		<aside class="w-72 h-full flex flex-col gap-6 p-3">
			<FormKit
				type="primedropdown"
				:options="widgetTypes"
				option-label="displayName"
				placeholder="Тип виджета"
				v-model="currentWidget.type"
			/>
			<template v-if="currentWidget.type">
				<Props
					v-if="currentWidget.type.scheme"
					:id="currentId"
					:scheme="currentWidget.type.scheme"
					v-model="currentWidget.props"
					:namespace="Object.keys(context.allVar(ctx, currentId))"
				/>
				<Slots
					v-if="currentWidget.type.slots"
					:slots="currentWidget.type.slots"
					v-model="currentWidget.slots"
					@add="currentId = $event"
				/>
				<Handlers
					v-model="currentWidget.init"
					:namespace="Object.keys(context.allVar(ctx, currentId))"
				/>
			</template>
		</aside>
	</div>
</template>
