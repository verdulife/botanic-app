import { Select as SelectPrimitive } from "bits-ui";
import Root from "./select.svelte";
import Content from "./content.svelte";
import Item from "./item.svelte";
import Trigger from "./trigger.svelte";
import Value from "./value.svelte";

const Group = SelectPrimitive.Group;
const GroupHeading = SelectPrimitive.GroupHeading;
const ScrollUpButton = SelectPrimitive.ScrollUpButton;
const ScrollDownButton = SelectPrimitive.ScrollDownButton;

export {
	Root,
	Content,
	Item,
	Trigger,
	Value,
	Group,
	GroupHeading,
	ScrollUpButton,
	ScrollDownButton,
	//
	Root as Select,
	Content as SelectContent,
	Item as SelectItem,
	Trigger as SelectTrigger,
	Value as SelectValue,
	Group as SelectGroup,
	GroupHeading as SelectGroupHeading,
	ScrollUpButton as SelectScrollUpButton,
	ScrollDownButton as SelectScrollDownButton,
};
