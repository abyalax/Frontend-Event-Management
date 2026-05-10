import { useInlineCrud } from '~/layers/shared/app/composable/table/states/useInlineCrud';
import { useCreateEvent } from './useCreateEvent';
import { useUpdateEvent } from './useUpdateEvent';
import { useDeleteEvent } from './useDeleteEvent';
import type { Event, CreateEventPayload } from '../types';

// Default event statuses
const EVENT_STATUSES = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' },
];

// Mock categories - in real app this should come from API
const MOCK_CATEGORIES = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Business' },
  { id: 3, name: 'Education' },
  { id: 4, name: 'Entertainment' },
  { id: 5, name: 'Sports' },
];

export const useTableStateEvents = () => {
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const authStore = useAuthStore();

  const crud = useInlineCrud<Event>({
    rowKey: 'id',
    maxNewRows: 5,
    maxSelectedRows: 5,

    createDefaultRow: () => ({
      id: '', // placeholder; real id assigned by server
      title: '',
      description: '',
      maxAttendees: null,
      isVirtual: false,
      location: '',
      startDate: '',
      endDate: '',
      status: 'draft',
      categoryId: 1,
      createdBy: authStore.user?.id ?? '',
    }),

    onSave: async ({ created, updated }) => {
      try {
        // Handle created events
        if (created.length > 0) {
          for (const event of created) {
            const payload: CreateEventPayload = {
              title: event.title,
              description: event.description || undefined,
              maxAttendees: event.maxAttendees || undefined,
              isVirtual: event.isVirtual,
              location: event.location,
              startDate: event.startDate ? new Date(event.startDate) : undefined,
              endDate: event.endDate ? new Date(event.endDate) : undefined,
              status: event.status,
              categoryId: event.categoryId,
              createdBy: authStore.user?.id ?? '',
              bannerMediaId: event.media?.[0]?.mediaId ?? '',
            };
            await createEventMutation.mutateAsync(payload);
          }
        }

        // Handle updated events
        if (updated.length > 0) {
          for (const update of updated) {
            await updateEventMutation.mutateAsync({
              id: update.id as string,
              payload: {
                ...update.changes,
                description: update.changes.description || undefined,
                maxAttendees: update.changes.maxAttendees || undefined,
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error('Save failed:', error);
        return false;
      }
    },

    onDelete: async (rows) => {
      try {
        const eventIds = rows.map((row) => row.id);
        await deleteEventMutation.mutateAsync(eventIds);
        return true;
      } catch (error) {
        console.error('Delete failed:', error);
        return false;
      }
    },
  });

  // Helper to get category name from ID
  const getCategoryName = (categoryId: number): string => {
    const category = MOCK_CATEGORIES.find((cat) => cat.id === categoryId);
    return category?.name || '-';
  };

  // Helper to get status label from value
  const getStatusLabel = (status: string): string => {
    const statusOption = EVENT_STATUSES.find((s) => s.value === status);
    return statusOption?.label || status;
  };

  return {
    // CRUD state and methods
    ...crud,

    // Additional helpers
    getCategoryName,
    getStatusLabel,
    EVENT_STATUSES,
    MOCK_CATEGORIES,
  };
};
