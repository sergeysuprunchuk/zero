export interface IContext {
	parent: IContext | null;
	namespace: { [key: string]: unknown };
}
