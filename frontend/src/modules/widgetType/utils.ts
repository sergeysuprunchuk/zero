import { IWidgetType } from "./types";
import { components } from "./config";

export const widgetByType = (name: string) => {
	return components[name] ?? null;
};

export const nullType = (): IWidgetType => {
	return {
		name: "",
		dataTransfer: false,
	};
};
