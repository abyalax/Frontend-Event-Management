import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { QueryDashboard } from '../types';

export const useQueryDashboard = () => {
  const router = useRouter();
  const route = useRoute();

  // Flag to prevent watcher loops
  const isUpdatingFromRoute = ref(false);

  // Initialize state from route query
  const state = reactive<QueryDashboard>({
    startDate: route.query.startDate as string,
    endDate: route.query.endDate as string,
  });

  // Create computed for query params
  const queryParams = computed(() => {
    const params: Record<string, unknown> = {};

    if (state.startDate) params.startDate = state.startDate;
    if (state.endDate) params.endDate = state.endDate;

    return params;
  });

  // Watch state -> update URL
  watch(
    state,
    async () => {
      if (isUpdatingFromRoute.value) return;

      // Wait for route update watchers to finish before syncing back
      await nextTick();

      // Convert state to URL query format
      const routeQuery: Record<string, string | null | undefined> = {};
      Object.entries(queryParams.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const strValue = String(value as string);
          routeQuery[key] = strValue;
        }
      });

      router.replace({ query: routeQuery });
    },
    { deep: true }
  );

  // Watch URL -> update state
  watch(
    () => route.query,
    (query) => {
      isUpdatingFromRoute.value = true;

      // Update state from route query
      state.startDate = query.startDate as string;
      state.endDate = query.endDate as string;

      // Reset flag after next tick
      nextTick(() => {
        isUpdatingFromRoute.value = false;
      });
    },
    { immediate: true }
  );

  // Return the state as the queryDashboard (like useTableFilter returns state)
  return { queryDashboard: state };
};
