import { IWidget } from "./types";
import { nullType } from "@/modules/widgetType";

export const nullWidget = (): IWidget => {
	return {
		id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
		type: nullType(),
	};
};
