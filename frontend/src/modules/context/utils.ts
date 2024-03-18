import { IContext } from "./types";

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
	if (key in ctx.namespace) {
		return ctx.namespace[key];
	} else if (ctx.parent !== null) {
		return get(ctx.parent, key);
	}
	return null;
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
