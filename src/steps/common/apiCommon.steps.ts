import { Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';

Then('răspunsul are statusul {int}', async ({ api }, status: number) => {
  expectStatus(api.lastResponse!, status);
});

Then('răspunsul indică succes', async ({ api }) => {
  const body = api.lastResponse!.body as { success?: boolean };
  if (body?.success !== true) throw new Error('răspunsul ar trebui să indice succes');
});
