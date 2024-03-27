import { IHandler } from "@/modules/handler";

export interface IEventDescription {
	name: string;
	hasData?: boolean;
}

export interface IEvent extends IEventDescription {
	handlers: IHandler[];
}
