import { expect } from '@playwright/test';
import { Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';

Then('the response status is {int}', async ({ world }: { world: UnifiedWorld }, status: number) => {
  expect(world.api.state.statusCode, `corp: ${JSON.stringify(world.api.state.body)}`).toBe(status);
});

Then('the response indicates success', async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as { success?: boolean };
  expect(body?.success).toBe(true);
});

Then('the response message contains {string}', async ({ world }: { world: UnifiedWorld }, text: string) => {
  const message = String((world.api.state.body as { message?: string })?.message ?? '');
  expect(message.toLowerCase()).toContain(text.toLowerCase());
});
