import { IWidget } from "../types/widget";

const widget = (): IWidget => {
	return {
		id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
		type: null,
	};
};

export const creator = {
	widget,
};
