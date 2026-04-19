import type { Permission } from '~/layers/users/app/types';

export const PERMISSIONS = Object.freeze({
  // User Management
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
  },

  // Role Management
  ROLE: {
    CREATE: 'role:create',
    READ: 'role:read',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
    ASSIGN_PERMISSION: 'role:assign-permission',
    ASSIGN_USER: 'role:assign-user',
  },

  // Event Management
  EVENT: {
    CREATE: 'event:create',
    READ: 'event:read',
    UPDATE: 'event:update',
    DELETE: 'event:delete',
    PUBLISH: 'event:publish',
    UNPUBLISH: 'event:unpublish',
  },

  // Ticket Management
  TICKET: {
    CREATE: 'ticket:create',
    READ: 'ticket:read',
    UPDATE: 'ticket:update',
    DELETE: 'ticket:delete',
    PUBLISH: 'ticket:publish',
    UNPUBLISH: 'ticket:unpublish',
  },

  // Order Management
  ORDER: {
    CREATE: 'order:create',
    READ: 'order:read',
    UPDATE: 'order:update',
    CANCEL: 'order:cancel',
    REFUND: 'order:refund',
  },

  // Payment
  PAYMENT: {
    CREATE: 'payment:create',
    READ: 'payment:read',
    VERIFY: 'payment:verify',
    REFUND: 'payment:refund',
  },

  // Check-in / Attendance
  CHECKIN: {
    READ: 'checkin:read',
    VALIDATE: 'checkin:validate',
    MANUAL: 'checkin:manual',
  },

  // Notification
  NOTIFICATION: {
    SEND: 'notification:send',
    READ: 'notification:read',
  },
});

export const permissionsList: Permission[] = [
  // User Management
  { id: 1, key: 'user:create', name: 'Create User' },
  { id: 2, key: 'user:read', name: 'Read User' },
  { id: 3, key: 'user:update', name: 'Update User' },
  { id: 4, key: 'user:delete', name: 'Delete User' },

  // Role Management
  { id: 5, key: 'role:create', name: 'Create Role' },
  { id: 6, key: 'role:read', name: 'Read Role' },
  { id: 7, key: 'role:update', name: 'Update Role' },
  { id: 8, key: 'role:delete', name: 'Delete Role' },
  { id: 9, key: 'role:assign-permission', name: 'Assign Permission to Role' },
  { id: 10, key: 'role:assign-user', name: 'Assign User to Role' },

  // Event Management
  { id: 11, key: 'event:create', name: 'Create Event' },
  { id: 12, key: 'event:read', name: 'Read Event' },
  { id: 13, key: 'event:update', name: 'Update Event' },
  { id: 14, key: 'event:delete', name: 'Delete Event' },
  { id: 15, key: 'event:publish', name: 'Publish Event' },
  { id: 16, key: 'event:unpublish', name: 'Unpublish Event' },

  // Ticket Management
  { id: 17, key: 'ticket:create', name: 'Create Ticket' },
  { id: 18, key: 'ticket:read', name: 'Read Ticket' },
  { id: 19, key: 'ticket:update', name: 'Update Ticket' },
  { id: 20, key: 'ticket:delete', name: 'Delete Ticket' },
  { id: 21, key: 'ticket:publish', name: 'Publish Ticket' },
  { id: 22, key: 'ticket:unpublish', name: 'Unpublish Ticket' },

  // Order Management
  { id: 23, key: 'order:create', name: 'Create Order' },
  { id: 24, key: 'order:read', name: 'Read Order' },
  { id: 25, key: 'order:update', name: 'Update Order' },
  { id: 26, key: 'order:cancel', name: 'Cancel Order' },
  { id: 27, key: 'order:refund', name: 'Refund Order' },

  // Payment
  { id: 28, key: 'payment:create', name: 'Create Payment' },
  { id: 29, key: 'payment:read', name: 'Read Payment' },
  { id: 30, key: 'payment:verify', name: 'Verify Payment' },
  { id: 31, key: 'payment:refund', name: 'Refund Payment' },

  // Check-in / Attendance
  { id: 32, key: 'checkin:read', name: 'Read Check-in' },
  { id: 33, key: 'checkin:validate', name: 'Validate Check-in' },
  { id: 34, key: 'checkin:manual', name: 'Manual Check-in' },

  // Notification
  { id: 35, key: 'notification:send', name: 'Send Notification' },
  { id: 36, key: 'notification:read', name: 'Read Notification' },

  // System (admin-only internal)
  { id: 37, key: 'permission:create', name: 'Create Permission' },
  { id: 38, key: 'permission:read', name: 'Read Permission' },
  { id: 39, key: 'permission:update', name: 'Update Permission' },
  { id: 40, key: 'permission:delete', name: 'Delete Permission' },
];

/**
 * Get permission name by key
 */
export const getPermissionName = (key: string): string => {
  return permissionsList.find((p) => p.key === key)?.name || key;
};

/**
 * Get permission key by id
 */
export const getPermissionKey = (id: number): string | undefined => {
  return permissionsList.find((p) => p.id === id)?.key;
};
