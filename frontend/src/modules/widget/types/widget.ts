import { IWidgetType } from "./widgetType";
import { IProp } from "./prop";
import { ISlot } from "./slot";
import { IHandler } from "./handler";

export interface IWidget {
	id: number;
	type: IWidgetType | null;
	props?: IProp[];
	slots?: ISlot[];
	emits?: [];
	init?: IHandler[];
}
