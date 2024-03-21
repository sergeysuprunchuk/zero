import { IParam } from "./types/param";
import { get, IContext, set } from "@/modules/context";
import { Nullable } from "primevue/ts-helpers";
import _ from "lodash";

export const bind = (
	ctx: IContext,
	params: Nullable<IParam[]>,
): { [key: string]: unknown } => {
	const result: { [key: string]: unknown } = {};

	params?.forEach((param: IParam) => {
		if (param.isVar) {
			result[param.name] = get(ctx, <string>param.value);
			if (param.twoWay) {
				result[`onUpdate:${param.name}`] = (event: any) => {
					result[param.name] = event;
					set(ctx, <string>param.value, event);
				};
			}
			return;
		}

		if (_.isString(param.value)) {
			result[param.name] = parseTemplate(ctx, param.value);
			return;
		}

		result[param.name] = param.value;
	});

	return result;
};

const parseTemplate = (ctx: IContext, template: string): string => {
	let value: string = "";

	for (let index = 0; index < template.length; index++) {
		if (template[index] === "{") {
			index++;
			let key: string = "";
			for (; index < template.length; index++) {
				if (template[index] === "}") {
					value += _.toString(get(ctx, key));
					break;
				}
				if (template[index] === " ") {
					continue;
				}
				key += template[index];
			}
			continue;
		}
		value += template[index];
	}

	return value;
};

export const castType = (type: string, value: string): unknown => {
	try {
		switch (type) {
			case "string":
				return value;
			case "number":
				return Number(value);
			case "boolean":
				return Boolean(value);
			case "object":
				return JSON.parse(value);
			default:
				return null;
		}
	} catch {
		return null;
	}
};
