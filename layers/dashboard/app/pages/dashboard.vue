<script setup lang="ts">
import Page from '~/layers/shared/app/components/layouts/Page.vue';
import DashboardTotalSales from '~/layers/dashboard/app/components/DashboardTotalSales.vue';
import DashboardTopEvents from '~/layers/dashboard/app/components/DashboardTopEvents.vue';
import DashboardTopCategories from '~/layers/dashboard/app/components/DashboardTopCategories.vue';
import DashboardDateFilter from '~/layers/dashboard/app/components/DashboardDateFilter.vue';

definePageMeta({
  middleware: 'authorization',
});

const breadcrumbs = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    active: true,
  },
];

const { queryDashboard } = useQueryDashboard();

const { data: totalSales, isLoading: totalSalesPending, error: totalSalesError } = useGetTotalSales(queryDashboard);
const { data: topEvents, isLoading: topEventsPending, error: topEventsError } = useGetTopEvents(queryDashboard);
const { data: topCategories, isLoading: topCategoriesPending, error: topCategoriesError } = useGetTopCategories(queryDashboard);
</script>

<template>
  <Page title="Dashboard" :breadcrumbs="breadcrumbs">
    <template #children>
      <div class="space-y-6">
        <!-- Date Filter -->
        <DashboardDateFilter />

        <!-- Dashboard Stats Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Total Sales -->
          <DashboardTotalSales :data="totalSales" :pending="totalSalesPending" :error="totalSalesError" />

          <!-- Top Events -->
          <DashboardTopEvents :data="topEvents" :pending="topEventsPending" :error="topEventsError" />

          <!-- Top Categories -->
          <DashboardTopCategories :data="topCategories" :pending="topCategoriesPending" :error="topCategoriesError" />
        </div>

        <!-- Additional Dashboard Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Placeholder for future charts -->
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Sales Trend</h3>
            <div class="text-muted-foreground text-center py-8">
              <svg class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p class="text-sm">Chart coming soon</p>
            </div>
          </div>

          <!-- Placeholder for recent activities -->
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Recent Activities</h3>
            <div class="text-muted-foreground text-center py-8">
              <svg class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm">Activity feed coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
