import { IWidget } from "@/modules/widget";

export interface ISlot {
	name: string;
	widgets: IWidget[];
	parameterNames?: string[];
}

export interface ISlotDescription {
	name: string;
	parameters?: ISlotParameter[];
}

export interface ISlotParameter {
	name: string;
	handler: any;
}
