import { userService } from '~/layers/users/server/services/users.service';
import type { UpdateUserDTO } from '~/layers/users/server/validators/users.schema';
import { idParamSchema, updateUserSchema } from '~/layers/users/server/validators/users.schema';
import { validate } from '~/layers/shared/server/utils/validate';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const params = validate(idParamSchema, {
    id: getRouterParam(event, 'id'),
  });

  const body = await readBody(event);
  const payload = validate(updateUserSchema, body);

  // Hash password if provided
  const dataToUpdate: UpdateUserDTO = {};
  if (payload.name) dataToUpdate.name = payload.name;
  if (payload.email) dataToUpdate.email = payload.email;
  if (payload.password) {
    dataToUpdate.password = await bcrypt.hash(payload.password, 10);
  }

  const updated = await userService.update(params.id, dataToUpdate);

  return updated;
});
