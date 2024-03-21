import { ref } from "vue";

const dictionary: any = {};

async function get(key: string, url: string) {
	if (key in dictionary) {
		dictionary[key].data.value = await (await fetch(url)).json();
		return dictionary[key].data;
	}

	const data = ref<any>();

	dictionary[key] = {
		url,
		data,
	};

	dictionary[key].data.value = await (await fetch(url)).json();

	return dictionary[key].data;
}

export const useQuery = () => {
	return {
		get,
		async _delete(url: string) {
			return await fetch(url, { method: "DELETE" });
		},
		async invalidate(key: string) {
			if (dictionary[key]) {
				await get(key, dictionary[key].url);
			}
		},
	};
};
