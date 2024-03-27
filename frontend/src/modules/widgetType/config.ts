import { IWidgetType } from "./types";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Grid from "@/ui/Grid.vue";
import Div from "@/ui/Div.vue";
import Dialog from "primevue/dialog";
import { FormKit } from "@formkit/vue";
import { IContext } from "@/modules/context";
import { IWidget } from "@/modules/widget";
import { bind } from "@/modules/param";
import _ from "lodash";

export const config: ({ component: any } & IWidgetType)[] = [
	{
		name: "Button",
		dataTransfer: false,
		params: [
			{
				binds: {
					type: "primetext",
					name: "label",
					placeholder: "этикетка",
				},
			},
			{
				binds: {
					type: "primedropdown",
					name: "severity",
					placeholder: "severity",
					options: [
						"success",
						"help",
						"secondary",
						"warning",
						"danger",
						"contrast",
					],
				},
			},
		],
		slots: [{ name: "default" }],
		component: Button,
		emits: [{ name: "click" }],
	},
	{
		name: "DataTable",
		dataTransfer: false,
		params: [
			{
				set: (arg: any): unknown => {
					return JSON.parse(arg);
				},
				get: (arg: any): unknown => {
					return JSON.stringify(arg);
				},
				binds: {
					type: "primetext",
					name: "value",
					placeholder: "данные",
				},
			},
		],
		slots: [{ name: "default" }],
		component: DataTable,
	},
	{
		name: "Column",
		dataTransfer: true,
		params: [
			{
				binds: {
					type: "primetext",
					name: "header",
					placeholder: "заголовок",
				},
			},
			{
				binds: {
					type: "primetext",
					name: "field",
					placeholder: "поле",
				},
			},
		],
		slots: [
			{
				name: "body",
				parameters: [
					{
						name: "data",
						handler: (context: IContext) => {
							if (!context.namespace["$owner"]) {
								return {};
							}

							let table: IWidget | null = null;

							let current: IContext | null = context;

							while (current !== null) {
								if (
									current.namespace["$owner"] &&
									(<IWidget>current.namespace["$owner"]).type.name ===
										"DataTable"
								) {
									table = <IWidget>current.namespace["$owner"];
									break;
								}

								if (current.parent) {
									current = current.parent;
									continue;
								}

								return {};
							}

							if (table !== null && table.params && table.params.length) {
								const value = bind(context, table.params)["value"];
								if (value && _.isArray(value) && value.length) {
									return { ...value[0] };
								}
							}

							return {};
						},
					},
				],
			},
		],
		component: Column,
	},
	{
		name: "Grid",
		dataTransfer: false,
		slots: [{ name: "default" }],
		component: Grid,
	},
	{
		name: "Div",
		dataTransfer: false,
		slots: [{ name: "default" }],
		component: Div,
	},
	{
		name: "Dialog",
		dataTransfer: false,
		params: [
			{
				twoWay: true,
				binds: {
					type: "checkbox",
					name: "visible",
					placeholder: "видимый",
				},
			},
		],
		slots: [{ name: "default" }],
		component: Dialog,
	},
	{
		name: "FormKit",
		dataTransfer: false,
		emits: [{ name: "submit", hasData: true }],
		params: [
			{
				binds: {
					name: "type",
					type: "primedropdown",
					options: [
						"form",
						"primetext",
						"primenumber",
						"primecheckbox",
						"primedropdown",
						"primemulti",
					],
					placeholder: "type",
				},
			},
			{
				binds: {
					name: "placeholder",
					type: "primetext",
					placeholder: "placeholder",
				},
			},
			{
				binds: {
					name: "binary",
					type: "primecheckbox",
					binary: true,
					placeholder: "binary",
				},
			},
			{
				set: (arg: any): unknown => {
					return JSON.parse(arg);
				},
				get: (arg: any): unknown => {
					return JSON.stringify(arg);
				},
				binds: { name: "options", type: "primetext", placeholder: "options" },
			},
			{
				binds: {
					name: "optionLabel",
					type: "primetext",
					placeholder: "optionLabel",
				},
			},
			{
				binds: {
					name: "optionValue",
					type: "primetext",
					placeholder: "optionValue",
				},
			},
			{
				binds: {
					name: "name",
					type: "primetext",
					placeholder: "name",
				},
			},
		],
		slots: [{ name: "default" }],
		component: FormKit,
	},
];

export const components: any = (() => {
	const components: any = {};
	config.forEach((i) => {
		components[i.name] = i.component;
	});
	return components;
})();
