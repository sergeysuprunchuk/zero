export interface IContext {
	id: number;
	namespace: { [key: string]: unknown };
	parent: IContext | null;
	children: IContext[];
}

const create = (
	id: number,
	parent: IContext | null = null,
	namespace: { [key: string]: unknown } = {},
): IContext => {
	const ctx = { id, parent, namespace, children: [] };

	if (parent !== null) {
		parent.children.push({ ...ctx, parent: { ...parent, children: [] } });
	}

	return ctx;
};

const createNoId = (
	parent: IContext | null = null,
	namespace: { [key: string]: unknown } = {},
): IContext => {
	return create(-1, parent, namespace);
};

const get = (ctx: IContext, key: string): unknown => {
	if (key in ctx.namespace) {
		return ctx.namespace[key];
	}
	return ctx.parent ? get(ctx.parent, key) : null;
};

const set = (ctx: IContext, key: string, value: unknown): void => {
	if (key in ctx.namespace) {
		ctx.namespace[key] = value;
	} else if (ctx.parent) {
		set(ctx.parent, key, value);
	}
};

const add = (ctx: IContext, key: string, value: unknown): void => {
	ctx.namespace[key] = value;
};

const byId = (root: IContext, id: number): IContext | null => {
	if (root.id === id) {
		return root;
	}

	for (const child of root.children) {
		const candidate = byId(child, id);
		if (candidate) {
			return candidate;
		}
	}

	return null;
};

const allVar = (root: IContext, id: number): { [key: string]: unknown } => {
	const namespace: { [key: string]: unknown } = {};

	let target: IContext | null = byId(root, id);

	while (target) {
		Object.keys(target.namespace).forEach((key) => {
			if (!(key in namespace)) {
				namespace[key] = (<IContext>target).namespace[key];
			}
		});
		target = target.parent;
	}

	return namespace;
};

export const context = {
	create,
	createNoId,
	get,
	set,
	add,
	byId,
	allVar,
};
