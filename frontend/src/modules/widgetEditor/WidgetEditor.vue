<script lang="ts" setup>
import { ParamForm } from "@/modules/param";
import { executeAll, IHandler, ISchema, MultiForm } from "@/modules/handler";
import { IWidgetType, TypeSelect } from "@/modules/widgetType";
import SelectButton from "primevue/selectbutton";
import { computed, provide, ref } from "vue";
import { Forms } from "./enums";
import { add, create, IContext } from "@/modules/context";
import { IWidget, nullWidget, Widget } from "@/modules/widget";
import SlotForm from "@/modules/slot/SlotForm.vue";
import WidgetTree from "@/modules/widgetTree/WidgetTree.vue";
import { MultiEventForm } from "@/modules/event";
import { ISlot, ISlotDescription, ISlotParameter } from "@/modules/slot";
import { set } from "lodash";

defineProps<{
	ctx: IContext;
	handlers: ISchema[];
}>();

const forms = computed(() => {
	const result: string[] = [Forms.TYPE];
	if (selectedWidget.value.type.params) {
		result.push(Forms.PARAMS);
	}

	if (selectedWidget.value.type.slots) {
		result.push(Forms.SLOTS);
	}

	if (selectedWidget.value.type.emits) {
		result.push(Forms.EVENTS);
	}

	if (selectedWidget.value.type.name) {
		result.push(Forms.HANDLERS);
	}

	return result;
});

const grids = ref<{ [id: number]: any }>({});

provide("grids", (id: number) => grids.value[id]);

provide("setGrids", (newGrids: { [id: number]: any }) => {
	grids.value = { ...grids.value, ...newGrids };
});

const currentForm = ref<string>(Forms.TYPE);

const setType = (type: IWidgetType) => {
	if (selectedWidget.value) {
		selectedWidget.value.type = type;
		currentForm.value = Forms.TYPE;
		return;
	}
};

const widgetKey = ref<number>(0);

//РЕФАКТОРИНГ ==>.

const contexts = ref<{ [id: number]: IContext }>({});

const getContext = (id: number): IContext => {
	return contexts.value[id];
};

const registerContext = (
	id: number,
	context: IContext,
	owner: IWidget,
): IContext => {
	contexts.value[id] = context;
	add(context, "$owner", owner);
	return context;
};

const addSlot = (
	context: IContext,
	parent: IWidget,
	slotDescription: ISlotDescription,
): IWidget => {
	let midlayer: IContext | null = null;

	if (slotDescription.parameters) {
		let namespace: { [key: string]: unknown } = {};

		slotDescription.parameters.forEach((parameter: ISlotParameter) => {
			namespace = { ...parameter.handler(context) };
		});

		midlayer = create(context, namespace);
	}

	const newWidget = nullWidget();

	registerContext(
		newWidget.id,
		create(midlayer !== null ? midlayer : context),
		newWidget,
	);

	if (!parent.slots) {
		parent.slots = [];
	}

	const index = parent.slots.findIndex(
		(slot: ISlot) => slot.name === slotDescription.name,
	);

	if (index === -1) {
		parent.slots.push({
			name: slotDescription.name,
			widgets: [newWidget],
			parameterNames: slotDescription.parameters?.map(
				(parameter: ISlotParameter) => parameter.name,
			),
		});
	} else {
		parent.slots[index].widgets.push(newWidget);
	}

	return newWidget;
};

const rootWidget = ref<IWidget>(nullWidget());

registerContext(rootWidget.value.id, create(), rootWidget.value);

const selectedWidget = ref<IWidget>(rootWidget.value);

const setHandlers = async (widget: IWidget, handlers: IHandler[]) => {
	await executeAll(getContext(widget.id), handlers);
	widget.handlers = handlers;
	console.log(widget, handlers, getContext(widget.id));
};
</script>

<template>
	<div class="h-screen w-screen flex overflow-hidden">
		<aside class="w-96 h-full bg-white border-r p-3 overflow-y-auto">
			<TypeSelect
				v-show="currentForm === Forms.TYPE"
				:model-value="selectedWidget?.type"
				@update:model-value="setType"
			/>
			<template v-if="selectedWidget">
				<ParamForm
					v-if="selectedWidget.type.params && currentForm === Forms.PARAMS"
					:key="selectedWidget.id + selectedWidget.type.name"
					:ctx="contexts[selectedWidget.id]"
					:schemas="selectedWidget.type.params"
					v-model="selectedWidget.params"
				/>
				<MultiEventForm
					v-if="selectedWidget.type.emits && currentForm === Forms.EVENTS"
					:key="selectedWidget.id + selectedWidget.type.name"
					:handlers="handlers"
					:ctx="contexts[selectedWidget.id]"
					v-model="selectedWidget.emits"
					:event-names="selectedWidget.type.emits"
				/>
				<MultiForm
					v-show="currentForm === Forms.HANDLERS"
					:ctx="contexts[selectedWidget.id]"
					:key="selectedWidget.id + selectedWidget.type.name"
					:schemas="handlers"
					:model-value="selectedWidget.handlers"
					@update:model-value="setHandlers(selectedWidget, $event), widgetKey++"
				/>
				<SlotForm
					v-if="selectedWidget.type.slots && currentForm === Forms.SLOTS"
					:options="selectedWidget.type.slots"
					@submit="
						(selectedWidget = addSlot(
							<IContext>getContext(selectedWidget.id),
							selectedWidget,
							$event,
						)),
							(currentForm = Forms.TYPE)
					"
				/>
			</template>
		</aside>
		<div class="w-full h-full">
			<header
				class="flex items-center justify-center gap-3 p-3 bg-white border-b"
			>
				<SelectButton
					:allow-empty="false"
					v-model="currentForm"
					:options="forms"
				/>
			</header>
			<div class="h-full w-full p-6">
				<Widget
					:key="widgetKey"
					:ctx="ctx"
					:widget="rootWidget"
				/>
			</div>
		</div>
		<aside class="w-96 h-full bg-white border-l p-3 overflow-y-auto">
			<WidgetTree
				:widget="rootWidget"
				v-model="selectedWidget"
				@update:model-value="currentForm = Forms.TYPE"
			/>
		</aside>
	</div>
</template>
