<script lang="ts" setup>
import { ParamForm } from "@/modules/param";
import { ISchema, MultiForm } from "@/modules/handler";
import { IWidgetType, TypeSelect } from "@/modules/widgetType";
import SelectButton from "primevue/selectbutton";
import { provide, ref } from "vue";
import _ from "lodash";
import { Forms } from "./enums";
import { IContext } from "@/modules/context";
import { IWidget, nullWidget, Widget } from "@/modules/widget";
import SlotForm from "@/modules/slot/SlotForm.vue";
import WidgetTree from "@/modules/widgetTree/WidgetTree.vue";
import { MultiEventForm } from "@/modules/event";

defineProps<{
	ctx: IContext;
	handlers: ISchema[];
}>();

const forms = _.values(Forms);

const contexts = ref<{ [key: number]: IContext }>({});

provide("register", (id: number, ctx: IContext): IContext => {
	contexts.value[id] = ctx;
	return ctx;
});

const grids = ref<{ [id: number]: any }>({});

provide("grids", (id) => grids.value[id]);

provide("setGrids", (newGrids: { [id: number]: any }) => {
	grids.value = { ...grids.value, ...newGrids };
});

const currentForm = ref<string>(forms[0]);

const widget = ref<IWidget>(nullWidget());

const currentWidget = ref<IWidget>(widget.value);

const setType = (type: IWidgetType) => {
	if (currentWidget.value) {
		currentWidget.value.type = type;
		return;
	}
};

const widgetKey = ref<number>(0);
</script>

<template>
	<div class="h-screen w-screen flex overflow-hidden">
		<aside class="w-96 h-full bg-white border-r p-3 overflow-y-auto">
			<TypeSelect
				v-show="currentForm === Forms.TYPE"
				:model-value="currentWidget?.type"
				@update:model-value="setType"
			/>
			<template v-if="currentWidget">
				<ParamForm
					v-if="currentWidget.type.params"
					v-show="currentForm === Forms.PARAMS"
					:key="currentWidget.id + currentWidget.type.name"
					:ctx="contexts[currentWidget.id]"
					:schemas="currentWidget.type.params"
					v-model="currentWidget.params"
				/>
				<MultiEventForm
					v-if="currentWidget.type.emits"
					v-show="currentForm === Forms.EVENTS"
					:handlers="handlers"
					:ctx="contexts[currentWidget.id]"
					v-model="currentWidget.emits"
					:event-names="currentWidget.type.emits"
				/>
				<MultiForm
					v-show="currentForm === Forms.HANDLERS"
					:ctx="contexts[currentWidget.id]"
					:key="currentWidget.id + currentWidget.type.name"
					:schemas="handlers"
					v-model="currentWidget.handlers"
					@update:model-value="widgetKey++"
				/>
				<SlotForm
					v-if="currentWidget.type.slots"
					v-show="currentForm === Forms.SLOTS"
					:key="currentWidget.id + currentWidget.type.name"
					:slot-names="currentWidget.type.slots"
					v-model="currentWidget.slots"
					@added="(currentWidget = $event), widgetKey++"
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
			<div class="h-full w-full">
				<Widget
					:key="widgetKey"
					:ctx="ctx"
					:widget="widget"
				/>
			</div>
		</div>
		<aside class="w-96 h-full bg-white border-l p-3 overflow-y-auto">
			<WidgetTree
				:widget="widget"
				v-model="currentWidget"
			/>
		</aside>
	</div>
</template>
