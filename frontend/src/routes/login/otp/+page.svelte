<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import * as Field from "$lib/components/ui/field";
    import * as InputOTP from "$lib/components/ui/input-otp";
    import { enhance } from '$app/forms';

    let { form } = $props();
    let otpValue = $state('');
    let loading = $state(false);
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
    <Card.Root class="mx-auto w-full max-w-sm">
        <Card.Header class="text-center">
            <Card.Title class="text-xl">Vérification</Card.Title>
            <Card.Description>
                Un code à 6 chiffres a été envoyé à ton email.
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <form 
                method="POST" 
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        loading = false;
                        await update();
                    };
                }}
            >
                <Field.Group>
                    <Field.Field>
                        <Field.Label for="otp" class="sr-only">Code de vérification</Field.Label>
                        
                        <input type="hidden" name="otp" value={otpValue} />
                        
                        <InputOTP.Root 
                            maxlength={6} 
                            id="otp" 
                            bind:value={otpValue}
                        >
                            {#snippet children({ cells })}
                                <InputOTP.Group class="gap-2.5 justify-center *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                    {#each cells as cell (cell)}
                                        <InputOTP.Slot {cell} />
                                    {/each}
                                </InputOTP.Group>
                            {/snippet}
                        </InputOTP.Root>

                        {#if form?.error}
                            <p class="text-sm text-red-500 text-center mt-2">{form.error}</p>
                        {/if}
                    </Field.Field>

                    <Button type="submit" class="w-full" disabled={loading || otpValue.length !== 6}>
                        {loading ? 'Vérification...' : 'Vérifier'}
                    </Button>

                    <Field.Description class="text-center">
                        <a href="/login" class="underline">Retour au login</a>
                    </Field.Description>
                </Field.Group>
            </form>
        </Card.Content>
    </Card.Root>
</div>