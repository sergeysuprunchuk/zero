<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { IProp } from "../types/prop";
import { caster } from "../utils/caster";
import { ref, watch } from "vue";
import ContextMenu from "primevue/contextmenu";

const props = defineProps<{
	id: number;
	namespace: string[];
	scheme: {
		name: string;
		type: string;
		[key: string]: unknown;
	}[];
	modelValue: IProp[] | undefined;
}>();

const emit = defineEmits(["update:modelValue"]);

const setProp = (name: string, value: unknown) => {
	if (props.modelValue) {
		const index = props.modelValue.findIndex(
			(value: IProp) => value.name === name,
		);

		if (index !== -1) {
			emit("update:modelValue", [
				...props.modelValue.slice(0, index),
				{
					...props.modelValue[index],
					type: typeof value,
					value: caster.toString(value),
				},
				...props.modelValue.slice(index + 1),
			]);
			return;
		}

		emit("update:modelValue", [
			...props.modelValue,
			{
				isVar: Boolean(variables.value[name]),
				name,
				type: typeof value,
				value: caster.toString(value),
			},
		]);
		return;
	}

	emit("update:modelValue", [
		{
			isVar: Boolean(variables.value[name]),
			name,
			type: typeof value,
			value: caster.toString(value),
		},
	]);
};

const getProp = (name: string) => {
	const value = props.modelValue?.find((value) => value.name === name);

	return value ? caster.toValue(value.type, value.value) : null;
};

const variables = ref<{ [key: string]: boolean }>({});

const menu = ref<any>(null);

const selectedName = ref<string | null>(null);

const onClick = (event: any, name: string) => {
	selectedName.value = name;
	menu.value.show(event);
};

const invert = () => {
	if (props.modelValue) {
		const index = props.modelValue.findIndex(
			(value: IProp) => value.name === selectedName.value,
		);
		if (index !== -1) {
			emit("update:modelValue", [
				...props.modelValue.slice(0, index),
				{
					...props.modelValue[index],
					type: "",
					value: "",
					isVar: variables.value[selectedName?.value ?? ""],
				},
				...props.modelValue.slice(index + 1),
			]);
			return;
		}
	}
};

const menuItems = [
	{
		label: "Изменить режим",
		command: () => {
			if (!selectedName.value) return;

			if (selectedName.value in variables.value) {
				variables.value[selectedName.value] =
					!variables.value[selectedName.value];
				invert();
				return;
			}
			variables.value[selectedName.value] = true;
			invert();
		},
	},
];

watch(
	() => props.id,
	() => {
		const newVariables: typeof variables.value = {};
		props.modelValue?.forEach((prop) => {
			if (prop.isVar) {
				newVariables[prop.name] = prop.isVar;
			}
		});
		variables.value = newVariables;
	},
);
</script>

<template>
	<div
		v-for="item in scheme"
		:key="item.name"
		@click.right="onClick($event, item.name)"
	>
		<FormKit
			v-if="!variables[item.name]"
			v-bind="item"
			:model-value="getProp(item.name)"
			@update:model-value="(value: unknown) => setProp(item.name, value)"
		/>

		<FormKit
			v-else
			type="primedropdown"
			:placeholder="item.placeholder"
			:options="namespace"
			:model-value="getProp(item.name)"
			@update:model-value="(value: unknown) => setProp(item.name, value)"
		/>
	</div>
	<ContextMenu
		ref="menu"
		:model="menuItems"
	/>
</template>
