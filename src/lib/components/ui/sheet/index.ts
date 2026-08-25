import { Dialog as SheetPrimitive } from "bits-ui";
import Root from "./sheet.svelte";
import Trigger from "./trigger.svelte";
import Close from "./close.svelte";
import Content from "./content.svelte";
import Overlay from "./overlay.svelte";
import Title from "./title.svelte";
import Description from "./description.svelte";
import Header from "./header.svelte";
import Footer from "./footer.svelte";

const Portal = SheetPrimitive.Portal;

export {
	Root,
	Trigger,
	Close,
	Content,
	Overlay,
	Title,
	Description,
	Header,
	Footer,
	Portal,
	//
	Root as Sheet,
	Trigger as SheetTrigger,
	Close as SheetClose,
	Content as SheetContent,
	Overlay as SheetOverlay,
	Title as SheetTitle,
	Description as SheetDescription,
	Header as SheetHeader,
	Footer as SheetFooter,
	Portal as SheetPortal,
};
