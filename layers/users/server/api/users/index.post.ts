import { userService } from '~/layers/users/server/services/users.service';
import { validate } from '~/layers/shared/server/utils/validate';
import { createUserSchema } from '~/layers/users/server/validators/users.schema';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const payload = validate(createUserSchema, body);

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const dataToCreate = {
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  };

  const created = await userService.create(dataToCreate);

  const userId = created.id as number;
  const fullUser = await userService.findById(userId);

  return fullUser;
});
