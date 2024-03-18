import { IWidgetType } from "@/modules/widgetType";
import { IParam } from "@/modules/param";
import { IHandler } from "@/modules/handler";
import { ISlot } from "@/modules/slot";
import { IEvent } from "@/modules/event";

export interface IWidget {
	id: number;
	type: IWidgetType;
	params?: IParam[];
	slots?: ISlot[];
	emits?: IEvent[];
	handlers?: IHandler[];
}
