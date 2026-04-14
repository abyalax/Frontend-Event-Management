import { userService } from '~/layers/users/server/services/users.service';
import { userQuerySchema } from '~/layers/users/server/validators/users.schema';

export default defineEventHandler(async (event) => {
  const query = validate(userQuerySchema, getQuery(event));
  return userService.list(query, {});
});
