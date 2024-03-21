export interface IParam {
	name: string;
	type: string;
	value: unknown;
	isVar: boolean;
	twoWay?: boolean;
}
