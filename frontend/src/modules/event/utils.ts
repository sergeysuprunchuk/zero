import { IContext } from "@/modules/context";
import { IEvent } from "./types";
import { executeAll } from "@/modules/handler";
import { Nullable } from "primevue/ts-helpers";

export const bind = (ctx: IContext, events: Nullable<IEvent[]>) => {
	const result: { [key: string]: () => void } = {};

	events?.forEach((event: IEvent) => {
		result[event.name] = async () => {
			await executeAll(ctx, event.handlers);
		};
	});

	return result;
};
