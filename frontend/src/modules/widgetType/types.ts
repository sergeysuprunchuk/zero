import { ISchema as IParamSchema } from "@/modules/param";
import { ISlotDescription } from "@/modules/slot/types.ts";

export interface IWidgetType {
	name: string;
	dataTransfer: boolean;
	params?: IParamSchema[];
	slots?: ISlotDescription[];
	emits?: string[];
}
