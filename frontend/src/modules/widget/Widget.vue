<script lang="ts" setup>
import { IContext } from "@/modules/context";
import { IWidget } from "./types";
import { bind } from "@/modules/param";
import { widgetByType } from "@/modules/widgetType";
import { computed, ref } from "vue";
import Skeleton from "primevue/skeleton";
import { executeAll } from "@/modules/handler";
import "primevue/datatable/DataTable.vue";

const props = defineProps<{ ctx: IContext; widget: IWidget }>();

const loading = ref<boolean>(true);

executeAll(props.ctx, props.widget.handlers).then(() => {
	loading.value = false;
});

const computedBind = computed(
	() => {
		return bind(props.ctx, props.widget.params);
	},
	{
		onTrigger: () => {
			console.log("computed slots");
		},
	},
);

const computedSlots = computed(
	() => {
		return props.widget.slots;
	},
	{
		onTrigger: () => {
			console.log("computed slots");
		},
	},
);

const getWidget = computed(() => props.widget);
</script>

<template>
	<Skeleton
		v-if="loading"
		class="w-full h-full"
	/>
	<component
		v-else
		:is="widgetByType(getWidget.type.name)"
		v-bind="computedBind"
	>
		<template
			v-for="slot in computedSlots"
			:key="slot.name"
			v-slot:[slot.name]
		>
			<template
				v-for="widget in slot.widgets"
				:key="widget.id"
			>
				<component
					v-if="widget.type.dataTransfer"
					:is="widgetByType(widget.type.name)"
					v-bind="bind(ctx, widget.params)"
					:columnKey="Math.random().toString(16)"
				>
					<template
						v-for="slot in widget.slots"
						:key="slot.name"
						v-slot:[slot.name]
					>
						<Widget
							v-for="widget in slot.widgets"
							:key="widget.id"
							:widget="widget"
							:ctx="ctx"
						/>
					</template>
				</component>
				<Widget
					v-else
					:widget="widget"
					:ctx="ctx"
				/>
			</template>
		</template>
	</component>
</template>
