import { Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';

Then('the response status is {int}', async ({ api }, status: number) => {
  expectStatus(api.lastResponse!, status);
});

Then('the response indicates success', async ({ api }) => {
  const body = api.lastResponse!.body as { success?: boolean };
  if (body?.success !== true) throw new Error('expected the response to indicate success');
});

Then('the response message contains {string}', async ({ api }, text: string) => {
  const message = String((api.lastResponse!.body as { message?: string })?.message ?? '');
  if (!message.toLowerCase().includes(text.toLowerCase())) {
    throw new Error(`expected message to contain "${text}", got "${message}"`);
  }
});
