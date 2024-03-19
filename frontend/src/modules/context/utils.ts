import { IContext } from "./types";
import _ from "lodash";
import { TreeNode } from "primevue/treenode";

export const create = (
	parent: IContext | null = null,
	namespace: { [key: string]: unknown } = {},
): IContext => {
	return {
		parent,
		namespace,
	};
};

export const get = (ctx: IContext, key: string): unknown => {
	let value: any = ctx.namespace;

	for (const newKey of key.split(".")) {
		if (_.isPlainObject(value) && newKey in value) {
			value = value[newKey];
		} else if (ctx.parent !== null) {
			return get(ctx.parent, key);
		} else {
			return null;
		}
	}

	return value;
};

export const set = (ctx: IContext, key: string, value: unknown): void => {
	if (key in ctx.namespace) {
		ctx.namespace[key] = value;
	} else if (ctx.parent !== null) {
		return set(ctx.parent, key, value);
	}
};

export const has = (ctx: IContext, key: string): boolean => {
	if (key in ctx.namespace) {
		return true;
	} else if (ctx.parent !== null) {
		return has(ctx.parent, key);
	}
	return false;
};

export const add = (ctx: IContext, key: string, value: unknown): void => {
	ctx.namespace[key] = value;
};

export const variables = (ctx: IContext): { [key: string]: unknown } => {
	if (ctx.parent !== null) {
		return { ...variables(ctx.parent), ...ctx.namespace };
	}
	return { ...ctx.namespace };
};

export const keyTree = (
	vars: { [key: string]: unknown },
	parent: string | null = null,
): TreeNode[] => {
	const nodes: TreeNode[] = [];

	_.keys(vars).forEach((key: string) => {
		let data = key;

		if (parent) {
			data = `${parent}.${key}`;
		}

		if (_.isPlainObject(vars[key])) {
			nodes.push({
				key,
				label: key,
				data,
				children: keyTree(<{ [key: string]: unknown }>vars[key], data),
			});
			return;
		}
		nodes.push({ key, label: key, data });
	});

	return nodes;
};
