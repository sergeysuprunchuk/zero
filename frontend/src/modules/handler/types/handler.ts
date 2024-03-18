import { IParam } from "@/modules/param";

export interface IHandler {
	name: string;
	params?: IParam[];
	aliases?: { [key: string]: string };
}
