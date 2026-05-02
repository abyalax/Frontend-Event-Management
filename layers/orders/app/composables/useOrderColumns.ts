import { h } from 'vue';
import { Badge } from '~/layers/shared/app/components/ui/badge';
import { formatDate, formatPrice } from '~/layers/shared/app/utils/formatter';
import type { ColumnDef } from '@tanstack/vue-table';
import type { Order } from '../types';
import { ExpandButton } from '~/layers/shared/app/components/fragments/table';
import { CheckboxCell, CheckboxHeader } from '~/layers/shared/app/components/fragments/input';
import ActionCellOrders from '../components/ActionCellOrders.vue';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'PENDING':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'EXPIRED':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'CANCELLED':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

interface OrderColumnsParams {
  continuePayment: (orderId: string, totalAmount: string) => void;
  downloadTicket: (pdfUrl?: string | undefined) => void;
  isProcessingPayment: Ref<boolean>;
  expanded: Ref<Order[]>;
}

export const useOrderColumns = (params: OrderColumnsParams): ColumnDef<Order>[] => {
  const isRowExpanded = (row: Order): boolean => {
    return params.expanded.value.some((item) => item.id === row.id);
  };

  const toggleRowExpansion = (row: Order) => {
    const isExpanded = params.expanded.value.some((item) => item.id === row.id);
    if (isExpanded) {
      params.expanded.value = params.expanded.value.filter((item) => item.id !== row.id);
    } else {
      params.expanded.value = [...params.expanded.value, row];
    }
  };

  return [
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
      id: 'expand',
      header: () => null,
      cell: ({ row }) => {
        // Use manual expansion state passed from parent
        const isExpanded = isRowExpanded(row.original);

        return h(ExpandButton, {
          expanded: isExpanded,
          'onUpdate:expanded': () => toggleRowExpansion(row.original),
          key: `expand-${row.id}`,
        });
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => {
        const order = row.original;
        return h('div', { class: 'font-mono text-slate-200' }, order.id.slice(0, 8) + '...');
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        let sortIcon = null;

        if (sortState === 'asc') {
          sortIcon = h('span', { class: 'text-xs' }, '↑');
        } else if (sortState === 'desc') {
          sortIcon = h('span', { class: 'text-xs' }, '↓');
        }

        return h(
          'button',
          {
            class: 'flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-white',
            onClick: () => column.toggleSorting(sortState === 'asc'),
          },
          ['Date', sortIcon]
        );
      },
      cell: ({ row }) => {
        return formatDate(row.getValue('createdAt'));
      },
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => {
        const sortState = column.getIsSorted();
        let sortIcon = null;

        if (sortState === 'asc') {
          sortIcon = h('span', { class: 'text-xs' }, '↑');
        } else if (sortState === 'desc') {
          sortIcon = h('span', { class: 'text-xs' }, '↓');
        }

        return h(
          'button',
          {
            class: 'flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-white',
            onClick: () => column.toggleSorting(sortState === 'asc'),
          },
          ['Total', sortIcon]
        );
      },
      cell: ({ row }) => {
        return h('div', { class: 'font-medium text-white' }, formatPrice(row.getValue('totalAmount')));
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return h(Badge, { class: getStatusColor(status) }, () => status);
      },
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const order = row.original;
        return h('div', { class: 'space-y-1' }, [
          ...order.items.map((item) => h('div', { class: 'text-xs text-slate-300' }, `${item.quantity}x ${item.ticketName || 'Unknown Ticket'}`)),
        ]);
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return h(ActionCellOrders, {
          order: row.original,
          isProcessingPayment: params.isProcessingPayment.value,
          onContinuePayment: (id: string, amount: string) => params.continuePayment(id, amount),
          onDownloadTicket: (url: string) => params.downloadTicket(url),
        });
      },
    },
  ];
};
