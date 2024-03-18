<script lang="ts" setup>
import { IWidget } from "../types/widget";
import Button from "primevue/button";
import { IProp } from "../types/prop";
import { caster } from "../utils/caster";
import { IContext, context } from "../utils/context";
import { ref, watch } from "vue";

const props = defineProps<{ parentCtx: IContext | null; widget: IWidget }>();

const ctx = ref<IContext>(context.create(props.widget.id, props.parentCtx));

context.add(ctx.value, "username", "zin");
context.add(ctx.value, "email", "zin@yandex.ru");

watch(
	() => props.widget.init,
	() => {
		props.widget.init?.forEach((handler) => {
			const callback = context.get(ctx.value, handler.name);
			if (!callback) return;
			(<any>callback)(getProps(handler.props)).then((data: any) => {
				context.add(ctx.value, "data", { ...data });
			});
		});
	},
	{ deep: true },
);

const getComponent = (widget: IWidget) => {
	return { Button, "": null }[widget.type?.name ?? ""];
};

const getProps = (props: IProp[] | undefined) => {
	const result: any = {};

	props?.forEach((prop: IProp) => {
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
		v-bind="getProps(widget.props)"
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
					v-bind="getProps(widget.props)"
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
