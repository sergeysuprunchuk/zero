const toString = (value: unknown): string => {
	if (!value) {
		return "";
	}

	if (typeof value === "object") {
		return JSON.stringify(value);
	}

	return value.toString();
};

const toValue = (type: string, value: string): unknown => {
	const dictionary: any = {
		string: String,
		number: Number,
		Boolean: Boolean,
		Object: JSON.parse,
	};

	try {
		return type in dictionary ? dictionary[type](value) : null;
	} catch {
		return null;
	}
};

export const caster = {
	toString,
	toValue,
};
