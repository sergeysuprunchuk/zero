import { IHandler } from "@/modules/handler";

export interface IEvent {
	name: string;
	handlers: IHandler[];
}
