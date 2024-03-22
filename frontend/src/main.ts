import { createApp } from "vue";
import App from "@/App.vue";
import PrimeVue from "primevue/config";
import Wind from "@/assets/presets/wind";
import { formkit } from "@/ui/formkit";
import "@/index.css";

const app = createApp(App)
	.use(PrimeVue, {
		unstyled: true,
		pt: Wind,
	})
	.use(formkit);

app.mount("#app");
