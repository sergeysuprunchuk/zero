import { ISchema as IParamSchema } from "@/modules/param";

export interface IWidgetType {
	name: string;
	dataTransfer: boolean;
	params?: IParamSchema[];
	slots?: string[];
	emits?: string[];
}
