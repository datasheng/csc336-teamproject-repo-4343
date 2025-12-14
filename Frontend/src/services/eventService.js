import api from './api';

const eventService = {
  getAllEvents: async () => {
    return await api.get('/events');
  },

  getEventById: async (eventId) => {
    return await api.get(`/events/${eventId}`);
  },

  createEvent: async (eventData) => {
    return await api.post('/events', eventData);
  },

  updateEvent: async (eventId, eventData) => {
    return await api.put(`/events/${eventId}`, eventData);
  },

  deleteEvent: async (eventId) => {
    return await api.delete(`/events/${eventId}`);
  },

  getEventsByOrg: async (orgId) => {
    return await api.get(`/events/by_org/${orgId}`);
  }
};

export default eventService;