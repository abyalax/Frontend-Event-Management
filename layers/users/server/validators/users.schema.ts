import z from 'zod';
import { metaRequestSchema } from '~/layers/shared/app/types/meta';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const userQuerySchema = z.object({
  ...metaRequestSchema.shape,
});

export const roleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
});

export const permissionSchema = z.object({
  id: z.number().int().positive(),
  key: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(150),
  email: z.email(),
  password: z.string().min(6),
  roles: z.array(roleSchema),
  permissions: z.array(permissionSchema),
});

export const createUserSchema = userSchema.omit({ id: true }).extend({
  roles: z.array(z.number().int().positive()).optional(),
  permissions: z.array(z.number().int().positive()).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export type RoleDTO = z.infer<typeof roleSchema>;
export type PermissionDTO = z.infer<typeof permissionSchema>;
export type UserDTO = z.infer<typeof userSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
