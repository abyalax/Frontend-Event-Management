import { userService } from '~/layers/users/server/services/users.service';
import { idParamSchema } from '~/layers/users/server/validators/users.schema';

export default defineEventHandler(async (event) => {
  const params = validate(idParamSchema, {
    id: getRouterParam(event, 'id'),
  });

  await userService.delete(params.id);

  setResponseStatus(event, 204);
  return null;
});
