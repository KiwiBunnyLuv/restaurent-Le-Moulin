<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
	} from "$lib/components/ui/field/index.js";

	const { form = null } = $props<{
		form?: {
			error?: string;
			requireCaptcha?: boolean;
			captchaQuestion?: string;
			captchaToken?: string;
			retryAfterMs?: number;
		} | null;
	}>();
	const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" >
			<FieldGroup>
					<Field>
						<FieldLabel for={`email-${id}`}>Email</FieldLabel>
						<Input
							id={`email-${id}`}
							name="email"
							type="email"
							placeholder="m@example.com"
							required
						/>
					</Field>
									<Field>
						<div class="flex items-center">
							<FieldLabel for={`password-${id}`}>Password</FieldLabel>

						</div>
						<Input
							id={`password-${id}`}
							name="password"
							type="password"
							required
						/>
					</Field>
				<Field>
					<Button type="submit" class="w-full">Login</Button>
				</Field>

				{#if form?.requireCaptcha}
					<Field>
						<FieldLabel for={`captcha-${id}`}>
							{form.captchaQuestion ?? 'Captcha'}
						</FieldLabel>
						<Input
							id={`captcha-${id}`}
							name="captcha_answer"
							type="text"
							autocomplete="off"
							required
						/>
						<input type="hidden" name="captcha_token" value={form?.captchaToken ?? ''} />
						{#if form?.retryAfterMs}
							<FieldDescription>
								Réessayez dans {Math.ceil(form.retryAfterMs / 1000)} secondes.
							</FieldDescription>
						{/if}
					</Field>
				{/if}

				{#if form?.error}
					<Field>
						<p class="text-sm text-red-600">{form.error}</p>
					</Field>
				{/if}
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
