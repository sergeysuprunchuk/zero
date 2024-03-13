import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import { createInput, defaultConfig, plugin } from "@formkit/vue";
import { App, defineComponent, h } from "vue";

const inputs: any = {};

(<any[]>[
	{
		type: "primetext",
		component: InputText,
		props: ["placeholder"],
	},
	{
		type: "primenumber",
		component: InputNumber,
		props: ["placeholder", "min", "max"],
	},
	{ type: "primecheckbox", component: Checkbox, props: ["binary"] },
	{
		type: "primedropdown",
		component: Dropdown,
		props: ["options", "optionLabel", "placeholder"],
	},
	{
		type: "primemulti",
		component: MultiSelect,
		props: ["options", "optionLabel", "placeholder"],
	},
]).forEach((input) => {
	inputs[input.type] = createInput(
		defineComponent({
			props: ["context"],
			setup(props) {
				return () =>
					h(input.component, {
						"class": "w-full",
						"modelValue": props.context._value,
						"onUpdate:modelValue": (event: any) => {
							props.context.node.input(event);
						},
						...(() => {
							const result: any = {};
							input.props.forEach(
								(prop: string) => (result[prop] = props.context[prop]),
							);
							return result;
						})(),
					});
			},
		}),
		{ props: input.props },
	);
});

export const formkit = {
	install(app: App) {
		app.use(plugin, defaultConfig({ inputs }));
	},
};
