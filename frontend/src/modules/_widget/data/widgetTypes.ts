import { IWidgetType } from "../types/widgetType";

export const widgetTypes: IWidgetType[] = [
	{
		name: "Button",
		displayName: "Кнопка",
		dataTransfer: false,
		scheme: [
			{ type: "primetext", name: "label", placeholder: "Этикетка" },
			{
				type: "primedropdown",
				name: "severity",
				placeholder: "Строгость",
				options: [
					"success",
					"secondary",
					"info",
					"warning",
					"danger",
					"contrast",
				],
			},
		],
		slots: ["default"],
		emits: ["click"],
	},
];
