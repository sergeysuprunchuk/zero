import { ref } from "vue";

export const useQuery = () => {
	const dictionary: any = {};

	return {
		async get(key: string, url: string) {
			if (key in dictionary) {
				fetch(url)
					.then((result: any) => result.json())
					.then((result: any) => {
						dictionary[key].data.value = result;
					});
				return;
			}

			const data = ref<any>();

			dictionary[key] = {
				url,
				data,
			};

			fetch(url)
				.then((result: any) => result.json())
				.then((result: any) => {
					dictionary[key].data.value = result;
				});

			return dictionary[key].data;
		},
		async _delete(url: string) {
			await fetch(url, { method: "DELETE" });
		},
		async invalidate(key: string) {},
	};
};
