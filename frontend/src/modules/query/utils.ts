import { ref } from "vue";
import axios from "axios";

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
			return await axios.delete(url);
		},
		async _add(url: string, body: any) {
			return await axios.post(url, body);
		},
		async invalidate(key: string) {
			if (dictionary[key]) {
				await get(key, dictionary[key].url);
			}
		},
	};
};
