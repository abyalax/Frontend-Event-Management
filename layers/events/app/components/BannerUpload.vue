<script setup lang="ts">
import { h, computed } from 'vue';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Image as ImageIcon } from 'lucide-vue-next';
import UploadFile from '~/layers/shared/app/components/fragments/input/UploadFIle.vue';
import type { UploadedFile } from '~/layers/shared/app/composable/useUploadFile';
import { EventMediaType, type Event } from '../types';

interface Props {
  event: Event;
  crud: {
    isRowEditable: (row: Event) => boolean;
    getFieldValue: <K extends keyof Event>(row: Event, field: K) => Event[K];
    handleFieldChange: <K extends keyof Event>(row: Event, field: K, value: Event[K]) => void;
  };
}

const props = defineProps<Props>();

// Create a computed property to ensure proper banner URL isolation
const bannerData = computed(() => {
  const isNewEvent = !!(props.event as Event & { _tmpId?: string })._tmpId || !props.event.id || props.event.id === '';

  // For new events, always check the event's own data first, not editedData
  const eventBannerUrl = (props.event as Event & { bannerUrl?: string }).bannerUrl;
  // For new events, we still need to check editedData for uploaded banners
  const editedBannerUrl = props.crud.getFieldValue(props.event, 'bannerUrl');
  // For new events, show banner if it was uploaded (in editedData), for existing events show the normal banner
  const displayBannerUrl = isNewEvent ? editedBannerUrl || eventBannerUrl : editedBannerUrl;

  const result = {
    isNewEvent,
    eventBannerUrl,
    editedBannerUrl,
    displayBannerUrl,
  };

  return result;
});

const handleUploadSuccess = (uploadedFile: UploadedFile) => {
  props.crud.handleFieldChange(props.event, 'bannerUrl', uploadedFile.url);
  // Also store media information for event creation
  props.crud.handleFieldChange(props.event, 'media', [
    {
      id: uploadedFile.id,
      eventId: props.event.id,
      mediaId: uploadedFile.mediaId,
      type: EventMediaType.BANNER,
      order: 0,
      media: {
        id: uploadedFile.mediaId,
        bucket: uploadedFile.bucket,
        objectKey: uploadedFile.objectKey,
        accessType: uploadedFile.accessType,
      },
    },
  ]);
};

// Prepare current files for v-model with event-specific IDs
// Show banner if displayBannerUrl is available (for both new and existing events)
const shouldShowBanner = computed(() => {
  const result = !!bannerData.value.displayBannerUrl;
  return result;
});

const currentFiles = computed(() => {
  if (!shouldShowBanner.value || !bannerData.value.displayBannerUrl) return [];

  return [
    {
      id: `banner-${props.event.id || 'new'}`,
      mediaId: `banner-${props.event.id || 'new'}`,
      url: bannerData.value.displayBannerUrl,
      filename: `banner-${props.event.id || 'new'}`,
      mimeType: 'image/*',
      size: 0,
      objectKey: '',
      bucket: '',
      accessType: 'public' as const,
    },
  ];
});

const handleRemoveBanner = (e: MouseEvent) => {
  e.stopPropagation();
  props.crud.handleFieldChange(props.event, 'bannerUrl', null);
};

const handleUpdateFiles = (files: UploadedFile[]) => {
  if (files.length === 0) {
    props.crud.handleFieldChange(props.event, 'bannerUrl', null);
  } else if (files.length > 0) {
    props.crud.handleFieldChange(props.event, 'bannerUrl', files.at(-1)!.url);
  }
};

// Render function for the component
const render = () => {
  if (!props.crud.isRowEditable(props.event)) {
    // Display mode - show banner if exists
    if (bannerData.value.displayBannerUrl) {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', {
          class: 'w-16 h-12 bg-cover bg-center rounded border',
          style: { backgroundImage: `url(${bannerData.value.displayBannerUrl})` },
        }),
        h(ImageIcon, { class: 'w-4 h-4 text-muted-foreground' }),
      ]);
    }
    return h('div', { class: 'flex items-center gap-2 text-muted-foreground' }, [
      h(ImageIcon, { class: 'w-4 h-4' }),
      h('span', { class: 'text-xs' }, 'No banner'),
    ]);
  }

  // Edit mode - show current banner and upload controls
  const bannerContent = bannerData.value.displayBannerUrl
    ? h('div', { class: 'relative' }, [
        h('div', {
          class: 'w-full h-20 bg-cover bg-center rounded border',
          style: { backgroundImage: `url(${bannerData.value.displayBannerUrl})` },
        }),
        // Remove button with X icon in top-right corner
        h(
          Button,
          {
            variant: 'destructive',
            size: 'icon',
            class: 'absolute top-1 right-1 h-6 w-6 rounded-full',
            onClick: handleRemoveBanner,
          },
          () => h('div', { class: 'w-3 h-3 flex items-center justify-center' }, '×')
        ),
      ])
    : null;

  return h('div', { class: 'space-y-2' }, [
    // Show current banner if exists
    bannerContent,

    // Upload button
    h(UploadFile, {
      modelValue: currentFiles.value,
      'onUpdate:modelValue': handleUpdateFiles,
      'onUpload-success': handleUploadSuccess,
      options: {
        type: `banner-${props.event.id || 'new'}`,
        accessType: 'public',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
      accept: 'image/jpeg,image/png,image/webp',
      buttonText: bannerData.value.displayBannerUrl ? 'Change Banner' : 'Upload Banner',
      buttonVariant: 'outline',
      buttonSize: 'sm',
      multiple: false,
      showPreview: false, // Hide preview in table cell for compactness
      showProgress: true,
      maxFiles: 1,
    }),
  ]);
};
</script>

<template>
  <component :is="render()" />
</template>
