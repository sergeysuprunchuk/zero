import { ISchema as IParamSchema } from "@/modules/param";

export interface ISchema {
	name: string;
	accepts?: IParamSchema[];
	returns?: string[];
}
