import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import ActionsCell from '../components/ActionsCell.vue';
import RoleBadge from '../components/RoleBadge.vue';
import type { User } from '../types';
import CheckboxHeader from '~/layers/shared/app/components/fragments/input/CheckboxHeader.vue';
import CheckboxCell from '~/layers/shared/app/components/fragments/input/CheckboxCell.vue';

export const userColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: (context) =>
      h(CheckboxHeader, {
        context: { table: context.table },
      }),
    cell: (context) =>
      h(CheckboxCell, {
        context: { row: context.row },
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
    cell: ({ row }) => h(ActionsCell, { ...row.original }),
  },
];
