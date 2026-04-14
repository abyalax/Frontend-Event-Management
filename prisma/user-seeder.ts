import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '~/generated/prisma/client';
import 'dotenv/config';
import { PERMISSIONS } from '~/layers/auth/app/common/const/permission';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function userSeeder() {
  console.info('⚡ Seeding deterministic roles/permissions...');

  const roleData = [{ name: 'Client' }, { name: 'Admin' }] as const;

  // --- Insert Roles ---
  await prisma.role.createMany({
    data: [...roleData],
  });

  const insertedRoles = await prisma.role.findMany();

  type RoleKey = (typeof roleData)[number]['name'];
  type RoleIDS = Record<RoleKey, number>;

  const roleIds = Object.fromEntries(insertedRoles.map((r) => [r.name, r.id])) as RoleIDS;

  // --- Insert Permissions ---
  const permissionsData = [
    { key: PERMISSIONS.ADMIN.CREATE_CLIENT, name: 'Create Client' },
    { key: PERMISSIONS.ADMIN.READ_CLIENT, name: 'Read Client' },
    { key: PERMISSIONS.ADMIN.UPDATE_CLIENT, name: 'Update Client' },
    { key: PERMISSIONS.ADMIN.DELETE_CLIENT, name: 'Delete Client' },

    { key: PERMISSIONS.ADMIN.CREATE_CV, name: 'Create CV' },
    { key: PERMISSIONS.ADMIN.READ_CV, name: 'Read CV' },
    { key: PERMISSIONS.ADMIN.UPDATE_CV, name: 'Update CV' },
    { key: PERMISSIONS.ADMIN.DELETE_CV, name: 'Delete CV' },

    { key: PERMISSIONS.ADMIN.READ_ANALYZE_CV, name: 'Read History Analysis CV' },
    { key: PERMISSIONS.ADMIN.SINGLE_ANALYZE_CV, name: 'Single Analysis CV' },
    { key: PERMISSIONS.ADMIN.BULK_ANALYZE_CV, name: 'Bulk Analysis CV' },

    { key: PERMISSIONS.ADMIN.CREATE_CHATS, name: 'Create Chats' },
    { key: PERMISSIONS.ADMIN.READ_CHATS, name: 'Read Chats' },
    { key: PERMISSIONS.ADMIN.UPDATE_CHATS, name: 'Update Chats' },
    { key: PERMISSIONS.ADMIN.DELETE_CHATS, name: 'Delete Chats' },

    { key: PERMISSIONS.ADMIN.CREATE_AGENT, name: 'Create Agents' },
    { key: PERMISSIONS.ADMIN.READ_AGENT, name: 'Read Agents' },
    { key: PERMISSIONS.ADMIN.UPDATE_AGENT, name: 'Update Agents' },
    { key: PERMISSIONS.ADMIN.DELETE_AGENT, name: 'Delete Agents' },

    { key: PERMISSIONS.ADMIN.CREATE_MESSAGES, name: 'Create Messages' },
    { key: PERMISSIONS.ADMIN.READ_MESSAGES, name: 'Read Messages' },
    { key: PERMISSIONS.ADMIN.UPDATE_MESSAGES, name: 'Update Messages' },
    { key: PERMISSIONS.ADMIN.DELETE_MESSAGES, name: 'Delete Messages' },
  ] as const;

  await prisma.permissions.createMany({ data: [...permissionsData] });

  type PermissionKey = (typeof permissionsData)[number]['key'];
  type PermissionIds = {
    [k in PermissionKey]: number;
  };

  const insertedPermissions = await prisma.permissions.findMany();
  const permissionIds = Object.fromEntries(insertedPermissions.map((p) => [p.key, p.id])) as PermissionIds;

  // --- Insert Users ---
  const [clientPass, adminPass] = await Promise.all([bcrypt.hash('client_pass', 10), bcrypt.hash('admin_pass', 10)]);

  const userData = [
    { name: 'Client', email: 'client@gmail.com', password: clientPass },
    { name: 'Admin', email: 'admin@gmail.com', password: adminPass },
  ] as const;

  await prisma.user.createMany({
    data: [...userData],
  });

  type UserKey = (typeof userData)[number]['email'];
  type UserIDS = Record<UserKey, number>;

  const insertedUsers = await prisma.user.findMany();
  const userIds = Object.fromEntries(insertedUsers.map((u) => [u.email, u.id])) as UserIDS;

  // --- Insert user_roles ---
  await prisma.userRoles.createMany({
    data: [
      { user_id: userIds['client@gmail.com'], role_id: roleIds['Client'] },
      { user_id: userIds['admin@gmail.com'], role_id: roleIds['Admin'] },
    ],
  });

  // --- Insert role_permissions ---
  await prisma.rolePermissions.createMany({
    data: [
      // Admin Permissions
      { role_id: roleIds.Admin, permission_id: permissionIds['client:read'] },
      { role_id: roleIds.Admin, permission_id: permissionIds['client:update'] },
      { role_id: roleIds.Admin, permission_id: permissionIds['client:delete'] },
      { role_id: roleIds.Admin, permission_id: permissionIds['client:create'] },

      { role_id: roleIds.Admin, permission_id: permissionIds['chat:create'] },
      { role_id: roleIds.Admin, permission_id: permissionIds['chat:read'] },
      { role_id: roleIds.Admin, permission_id: permissionIds['chat:update'] },
      { role_id: roleIds.Admin, permission_id: permissionIds['chat:delete'] },

      // Client Permissions
      { role_id: roleIds.Client, permission_id: permissionIds['chat:create'] },
      { role_id: roleIds.Client, permission_id: permissionIds['chat:read'] },
      { role_id: roleIds.Client, permission_id: permissionIds['chat:update'] },
      { role_id: roleIds.Client, permission_id: permissionIds['chat:delete'] },
    ],
  });

  console.info('✅ Seeding User roles/permissions done!');
}
