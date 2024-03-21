export interface ISchema {
	set?: (arg: unknown) => unknown;
	get?: (arg: unknown) => unknown;
	twoWay?: boolean;
	binds: {
		type: string;
		name: string;
		[key: string]: unknown;
	};
}
