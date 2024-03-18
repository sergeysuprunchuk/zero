import { IWidgetType } from "./types";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

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
		slots: ["default"],
		component: Button,
		emits: ["click"],
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
		slots: ["default"],
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
		slots: ["body"],
		component: Column,
	},
];

export const components: any = (() => {
	const components: any = {};
	config.forEach((i) => {
		components[i.name] = i.component;
	});
	return components;
})();
