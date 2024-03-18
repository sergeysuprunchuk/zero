export interface IWidgetType {
	name: string;
	displayName: string;
	dataTransfer: boolean;
	scheme?: { name: string; type: string; [key: string]: unknown }[];
	slots?: string[];
	emits?: string[];
	alias?: string;
}
