<script lang="ts" setup>
import { bottomItems, sidebarItems, type SidebarAppProps } from ".";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import { useLayout } from "../../../context/useLayout";
import SidebarGroupApp from "./AppSidebarGroup.vue";
import { cn } from "../../../lib/utils";
import SidebarUser from "./AppSidebarUser.vue";

defineProps<SidebarAppProps>();

const { collapsible, variant } = useLayout();
const { state } = useSidebar();
const { path } = useRoute();
const navigations = sidebarItems();

const isActive = (url: string) => path === url;
</script>

<template>
  <Sidebar :collapsible="collapsible" :variant="variant">
    <SidebarHeader class="border-b border-border/40 p-4">
      <div class="flex items-center gap-3">
        <div v-if="state !== 'collapsed'" class="flex flex-col min-w-0">
          <span class="font-semibold text-sm truncate">Boilerplate Nuxt</span>
          <span class="text-xs text-muted-foreground">v1.0.0</span>
        </div>
      </div>
    </SidebarHeader>
    <SidebarContent class="flex-1 overflow-y-auto">
      <!-- Main Navigation Groups -->
      <SidebarGroupApp
        v-for="section in navigations"
        :key="section.group"
        :section="section"
      />

      <!-- Bottom Navigations -->
      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in bottomItems" :key="item.title">
              <SidebarMenuButton
                as-child
                :class="
                  cn(
                    'px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors',
                    isActive(item.url) &&
                      'bg-accent text-accent-foreground font-medium',
                  )
                "
              >
                <RouterLink :to="item.url" class="flex items-center gap-3">
                  <component :is="item.icon" class="w-4 h-4" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer With User Information -->
    <SidebarFooter>
      <SidebarUser :user="{ email: user?.email, name: user?.name }" />
    </SidebarFooter>
  </Sidebar>
</template>
