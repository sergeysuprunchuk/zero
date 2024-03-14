<script lang="ts" setup>
import { IWidget } from "../types/widget";
import Button from "primevue/button";
import { IProp } from "../types/prop";
import { caster } from "../utils/caster";
import { IContext, context } from "../utils/context";
import { ref } from "vue";

const props = defineProps<{ parentCtx: IContext | null; widget: IWidget }>();

const ctx = ref<IContext>(context.create(props.widget.id, props.parentCtx));

context.add(ctx.value, "username", "zin");
context.add(ctx.value, "email", "zin@yandex.ru");

const getComponent = (widget: IWidget) => {
	return { Button, "": null }[widget.type?.name ?? ""];
};

const getProps = (widget: IWidget) => {
	const result: any = {};

	widget.props?.forEach((prop: IProp) => {
		if (prop.isVar) {
			result[prop.name] = context.get(ctx.value, prop.value);
			return;
		}
		result[prop.name] = caster.toValue(prop.type, prop.value);
	});

	return result;
};
</script>

<template>
	<component
		:is="getComponent(widget)"
		v-bind="getProps(widget)"
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
					v-if="widget.type?.dataTransfer"
					:is="getComponent(widget)"
					v-bind="getProps(widget)"
				>
					<template
						v-for="slot in widget.slots"
						:key="slot.name"
						v-slot:[slot.name]="slotProps"
					>
						<Widget
							:parent-ctx="context.createNoId(ctx, { ...slotProps })"
							v-for="widget in slot.widgets"
							:key="widget.id"
							:widget="widget"
						/>
					</template>
				</component>
				<Widget
					v-else
					:parent-ctx="context.createNoId(ctx, { ...slotProps })"
					:widget="widget"
				/>
			</template>
		</template>
	</component>
</template>
