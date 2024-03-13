import { createApp } from "vue";
import App from "@/App.vue";
import PrimeVue from "primevue/config";
import Wind from "@/assets/presets/wind";
import { defaultConfig, plugin } from "@formkit/vue";
import "@/index.css";

createApp(App)
	.use(PrimeVue, {
		unstyled: true,
		pt: Wind,
	})
	.use(plugin, defaultConfig)
	.mount("#app");
