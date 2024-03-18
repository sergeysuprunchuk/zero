import { IWidgetType } from "@/modules/widgetType";
import { IParam } from "@/modules/param";
import { IHandler } from "@/modules/handler";
import { ISlot } from "@/modules/slot";

export interface IWidget {
	id: number;
	type: IWidgetType;
	params?: IParam[];
	slots?: ISlot[];
	emits?: any[];
	handlers?: IHandler[];
}
