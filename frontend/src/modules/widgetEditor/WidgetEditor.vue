<script lang="ts" setup>
import { ParamForm } from "@/modules/param";
import { ISchema, MultiForm } from "@/modules/handler";
import { IWidgetType, TypeSelect } from "@/modules/widgetType";
import SelectButton from "primevue/selectbutton";
import { computed, reactive, ref } from "vue";
import _ from "lodash";
import { Forms } from "./enums";
import { IContext } from "@/modules/context";
import { IWidget, nullWidget, Widget } from "@/modules/widget";
import { Nullable } from "primevue/ts-helpers";
import SlotForm from "@/modules/slot/SlotForm.vue";
import WidgetTree from "@/modules/widgetTree/WidgetTree.vue";

defineProps<{
	ctx: IContext;
	handlers: ISchema[];
}>();

const forms = _.values(Forms);

const currentForm = ref<string>(forms[0]);

const widget = reactive<IWidget>(nullWidget());

const currentWidget = ref<Nullable<IWidget>>(widget);

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
					:ctx="ctx"
					:schemas="currentWidget.type.params"
					v-model="currentWidget.params"
				/>
				<MultiForm
					v-show="currentForm === Forms.HANDLERS"
					:ctx="ctx"
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
			<div class="flex items-center justify-center h-full w-full">
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
