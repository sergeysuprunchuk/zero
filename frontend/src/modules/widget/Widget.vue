<script lang="ts" setup>
import { add, create, IContext, invert } from "@/modules/context";
import { IWidget } from "./types";
import { bind, castType } from "@/modules/param";
import { widgetByType } from "@/modules/widgetType";
import { inject, ref } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import { executeAll } from "@/modules/handler";
import { bind as bindEvent } from "@/modules/event";

const props = defineProps<{ ctx: IContext; widget: IWidget }>();

const newCtx = ref<IContext>(create(props.ctx));

add(newCtx.value, "add variable", async ({ key, type, value }: any) => {
	add(newCtx.value, key, castType(type, value));
});

add(newCtx.value, "invert", async ({ key }: any) => {
	invert(newCtx.value, key);
});

const register = inject("register", (_: number, ctx: IContext): IContext => {
	return ctx;
});

register(props.widget.id, newCtx.value);

const loading = ref<boolean>(true);

executeAll(newCtx.value, props.widget.handlers).then(() => {
	loading.value = false;
});
</script>

<template>
	<ProgressSpinner
		v-if="loading"
		style="width: 50px; height: 50px"
		strokeWidth="4"
	/>
	<component
		v-else
		:is="widgetByType(widget.type.name)"
		v-bind="bind(newCtx, widget.params)"
		v-on.prevent="bindEvent(newCtx, widget.emits)"
	>
		<template
			v-for="slot in widget.slots"
			:key="slot.name"
			v-slot:[slot.name]="slotProps"
		>
			<template
				v-for="widget in slot.widgets"
				:key="widget.id"
			>
				<component
					v-if="widget.type.dataTransfer"
					:is="widgetByType(widget.type.name)"
					v-bind="bind(newCtx, widget.params)"
				>
					<template
						v-for="slot in widget.slots"
						:key="slot.name"
						v-slot:[slot.name]="slotProps"
					>
						<Widget
							v-for="widget in slot.widgets"
							:key="widget.id"
							:widget="widget"
							:ctx="create(newCtx, slotProps?.data ?? {})"
						/>
					</template>
				</component>
				<Widget
					v-else
					:widget="widget"
					:ctx="create(newCtx, slotProps?.data ?? {})"
				/>
			</template>
		</template>
	</component>
</template>
