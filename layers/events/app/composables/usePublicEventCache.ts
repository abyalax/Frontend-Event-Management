import type { Event } from '../types';

export function usePublicEventCache() {
  const cache = useState<Record<string, Event>>('public-events-cache', () => ({}));

  const setPublicEvent = (event: Event) => {
    cache.value = {
      ...cache.value,
      [event.id]: event,
    };
  };

  const getPublicEvent = (id: string) => cache.value[id];

  return {
    cache,
    setPublicEvent,
    getPublicEvent,
  };
}
