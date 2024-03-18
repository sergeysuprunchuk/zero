import { IHandler } from "../types/handler";

export const handlers: IHandler[] = [
	{
		name: "get",
		scheme: [{ type: "primetext", name: "url", placeholder: "url" }],
	},
];
