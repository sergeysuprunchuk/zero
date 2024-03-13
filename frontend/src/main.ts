import { createApp } from "vue";
import App from "@/App.vue";
import PrimeVue from "primevue/config";
import Wind from "@/assets/presets/wind";
import { formkit } from "@/ui/extensions/formkit";
import "@/index.css";

createApp(App)
	.use(PrimeVue, {
		unstyled: true,
		pt: Wind,
	})
	.use(formkit)
	.mount("#app");
