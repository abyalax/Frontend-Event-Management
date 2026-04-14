import { userService } from '~/layers/users/server/services/users.service';
import { idParamSchema } from '~/layers/users/server/validators/users.schema';

export default defineEventHandler(async (event) => {
  const params = validate(idParamSchema, {
    id: getRouterParam(event, 'id'),
  });

  return await userService.findById(params.id);
});
