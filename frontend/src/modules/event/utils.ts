import { create, IContext } from "@/modules/context";
import { IEvent } from "./types";
import { executeAll } from "@/modules/handler";
import { Nullable } from "primevue/ts-helpers";

export const bind = (ctx: IContext, events: Nullable<IEvent[]>) => {
	const result: { [key: string]: (e: any) => void } = {};

	events?.forEach((event: IEvent) => {
		result[event.name] = async (e: any) => {
			console.log(e);
			await executeAll(
				event.hasData ? create(ctx, { event: e }) : ctx,
				event.handlers,
			);
		};
	});

	return result;
};
