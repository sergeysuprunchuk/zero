<script lang="ts" setup>
import { IWidget } from "../types/widget";
import Button from "primevue/button";
import { IProp } from "../types/prop";
import { caster } from "../utils/caster";

defineProps<{ widget: IWidget }>();

const getComponent = (widget: IWidget) => {
	return { Button, "": null }[widget.type?.name ?? ""];
};

const getProps = (widget: IWidget) => {
	const result: any = {};

	widget.props?.forEach((prop: IProp) => {
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
			v-slot:[slot.name]
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
						v-slot:[slot.name]
					>
						<Widget
							v-for="widget in slot.widgets"
							:key="widget.id"
							:widget="widget"
						/>
					</template>
				</component>
				<Widget
					v-else
					:widget="widget"
				/>
			</template>
		</template>
	</component>
</template>
