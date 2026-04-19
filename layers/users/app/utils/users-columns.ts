import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { Checkbox } from '~/layers/shared/app/components/ui/checkbox';
import ActionsCell from '../components/ActionsCell.vue';
import RoleBadge from '../components/RoleBadge.vue';
import type { User } from '../types';

export const userColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: (context) =>
      h(Checkbox, {
        checked: context.table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (checked: boolean) => context.table.toggleAllPageRowsSelected(checked),
      }),
    cell: (context) =>
      h(Checkbox, {
        checked: context.row.getIsSelected(),
        'onUpdate:checked': (checked: boolean) => context.row.toggleSelected(checked),
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (context) => h('div', { class: 'font-medium' }, context.row.getValue('name')),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (context) => h('div', { class: 'lowercase' }, context.row.getValue('email')),
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: (context) => {
      const roles = context.row.getValue('roles') as Array<{ name: string }>;
      return h(
        'div',
        { class: 'flex gap-1 flex-wrap' },
        roles.map((role) =>
          h(RoleBadge, {
            key: role.name,
            role: role.name,
          })
        )
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => h(ActionsCell),
  },
];
