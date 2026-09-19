import { create } from 'zustand';
import {
  archiveEvent,
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
} from '@/services/event.service';
import type { Event, EventInput, EventStatus } from '@/types/domain';

type EventStore = {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  search: string;
  statusFilter: EventStatus | 'all';
  setSearch: (search: string) => void;
  setStatusFilter: (statusFilter: EventStatus | 'all') => void;
  loadEvents: (weddingId: string) => Promise<void>;
  loadEvent: (eventId: string) => Promise<void>;
  createEvent: (input: EventInput) => Promise<Event>;
  updateEvent: (eventId: string, input: EventInput) => Promise<Event>;
  archiveEvent: (eventId: string) => Promise<void>;
  clearSelectedEvent: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  selectedEvent: null,
  loading: false,
  saving: false,
  error: null,
  search: '',
  statusFilter: 'all',
  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  loadEvents: async (weddingId) => {
    set({ loading: true, error: null });
    try {
      set({ events: await getEvents(weddingId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Events could not be loaded.'), loading: false });
    }
  },
  loadEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      set({ selectedEvent: await getEvent(eventId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Event could not be loaded.'), loading: false });
    }
  },
  createEvent: async (input) => {
    set({ saving: true, error: null });
    try {
      const event = await createEvent(input);
      set((state) => ({ events: [event, ...state.events], saving: false }));
      return event;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Event could not be created.'), saving: false });
      throw error;
    }
  },
  updateEvent: async (eventId, input) => {
    const previousEvents = get().events;
    const previousSelected = get().selectedEvent;
    set((state) => ({
      saving: true,
      error: null,
      events: state.events.map((event) =>
        event.id === eventId ? { ...event, ...input, weddingId: input.weddingId } : event,
      ),
      selectedEvent:
        state.selectedEvent?.id === eventId
          ? { ...state.selectedEvent, ...input, weddingId: input.weddingId }
          : state.selectedEvent,
    }));
    try {
      const event = await updateEvent(eventId, input);
      set((state) => ({
        events: state.events.map((item) => (item.id === eventId ? event : item)),
        selectedEvent: state.selectedEvent?.id === eventId ? event : state.selectedEvent,
        saving: false,
      }));
      return event;
    } catch (error) {
      set({
        events: previousEvents,
        selectedEvent: previousSelected,
        error: getErrorMessage(error, 'Event could not be updated.'),
        saving: false,
      });
      throw error;
    }
  },
  archiveEvent: async (eventId) => {
    const previousEvents = get().events;
    set((state) => ({
      saving: true,
      error: null,
      events: state.events.filter((event) => event.id !== eventId),
    }));
    try {
      await archiveEvent(eventId);
      set({ selectedEvent: null, saving: false });
    } catch (error) {
      set({
        events: previousEvents,
        error: getErrorMessage(error, 'Event could not be archived.'),
        saving: false,
      });
      throw error;
    }
  },
  clearSelectedEvent: () => set({ selectedEvent: null }),
}));
