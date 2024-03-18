import { IParam } from "./types/param";
import { get, IContext } from "@/modules/context";
import { Nullable } from "primevue/ts-helpers";

export const bind = (
	ctx: IContext,
	params: Nullable<IParam[]>,
): { [key: string]: unknown } => {
	const result: { [key: string]: unknown } = {};

	params?.forEach((param: IParam) => {
		if (param.isVar) {
			result[param.name] = get(ctx, <string>param.value);
			return;
		}
		result[param.name] = param.value;
	});

	return result;
};
