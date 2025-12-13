const API_BASE_URL = 'http://localhost:5000/api';

export const eventService = {
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const events = await response.json();
      return { success: true, events };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, error: error.message };
    }
  },

  async getEventById(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      const event = await response.json();
      return { success: true, event };
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, error: error.message };
    }
  }
};