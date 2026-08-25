<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { LogIn } from "lucide-svelte/icons";

	type Props = {
		message?: string;
		action?: { label: string; href: string };
	};

	let { message = "Esta vista requiere iniciar sesión.", action }: Props = $props();
</script>

<Card.Root class="border-dashed bg-muted/30">
	<Card.Content class="flex flex-col items-center gap-3 py-6 text-center">
		<div
			class="bg-background text-muted-foreground flex size-10 items-center justify-center rounded-full border"
		>
			<LogIn class="size-5" />
		</div>
		<p class="text-sm">{message}</p>
		<Button href={action?.href ?? "/app/login"} variant="default">
			{action?.label ?? "Iniciar sesión"}
		</Button>
	</Card.Content>
</Card.Root>
