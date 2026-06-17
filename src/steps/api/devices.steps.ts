import { When, Then } from '../bdd';
import { newDevice, newHeartbeat } from '../../data/generators/deviceGenerator';
import { validateDevice } from '../../validators/api/deviceResponseValidators';

When('agentul înregistrează un dispozitiv nou', async ({ api }) => {
  const res = await api.devices.register(newDevice());
  api.lastResponse = res;
  const id = (res.body as any)?.data?.deviceId;
  if (id) api.context.set('deviceId', id);
});

When('agentul înregistrează un dispozitiv fără nume', async ({ api }) => {
  api.lastResponse = await api.devices.register(newDevice({ name: '' }));
});

When('agentul trimite un semnal de viață', async ({ api }) => {
  api.lastResponse = await api.devices.heartbeat(api.context.get<string>('deviceId'), newHeartbeat());
});

Then('dispozitivul respectă schema', async ({ api }) => {
  validateDevice(api.lastResponse! as any);
});
