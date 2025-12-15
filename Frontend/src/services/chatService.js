import api from './api';

export const chatService = {
  sendMessage: async (message) => {
    return await api.post('/chats', { message });
  },

  getChatHistory: async () => {
    return await api.get('/chats');
  },

  clearChatHistory: async () => {
    // Implement if needed
    return { success: true };
  }
};
