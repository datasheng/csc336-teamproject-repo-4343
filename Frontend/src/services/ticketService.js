import api from './api';

export const ticketService = {
  createTicket: async (ticketData) => {
    return await api.post('/tickets', ticketData);
  },

  getTicketById: async (ticketId) => {
    return await api.get(`/tickets/${ticketId}`);
  },

  getUserTickets: async (userId) => {
    return await api.get(`/tickets/by_user/${userId}`);
  },

  getEventTickets: async (eventId) => {
    return await api.get(`/tickets/event/${eventId}`);
  },

  updateTicketStatus: async (ticketId, status) => {
    return await api.put(`/tickets/${ticketId}`, { ticket_status: status });
  }
};