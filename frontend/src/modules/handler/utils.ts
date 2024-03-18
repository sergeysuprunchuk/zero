import { add, get, IContext } from "@/modules/context";
import { IHandler } from "./types/handler";
import _ from "lodash";
import { bind } from "@/modules/param";
import { Nullable } from "primevue/ts-helpers";

export const execute = async (
	ctx: IContext,
	handler: IHandler,
): Promise<void> => {
	const method = get(ctx, handler.name);

	if (_.isFunction(method)) {
		try {
			const data = await (<any>method)(bind(ctx, handler.params));

			if (_.isPlainObject(data)) {
				_.keys(data).forEach((key: string) => {
					let name: string = key;

					if (
						handler.aliases &&
						key in handler.aliases &&
						handler.aliases[key].length
					) {
						name = handler.aliases[key];
					}

					add(ctx, name, data[key]);
				});
			}
		} catch (error: any) {
			console.error(error.message);
		}
	}
};

export const executeAll = async (
	ctx: IContext,
	handlers: Nullable<IHandler[]>,
): Promise<void> => {
	if (handlers) {
		for (const handler of handlers) {
			await execute(ctx, handler);
		}
	}
};
