import { IProp } from "@/modules/widget/types/prop.ts";

export interface IHandler {
	name: string;
	scheme?: { name: string; type: string; [key: string]: unknown }[];
	props?: IProp[];
}
