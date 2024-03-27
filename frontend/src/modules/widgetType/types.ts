import { ISchema as IParamSchema } from "@/modules/param";
import { ISlotDescription } from "@/modules/slot/types.ts";
import { IEventDescription } from "@/modules/event/types.ts";

export interface IWidgetType {
	name: string;
	dataTransfer: boolean;
	params?: IParamSchema[];
	slots?: ISlotDescription[];
	emits?: IEventDescription[];
}
