import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader, Trash2, Bot, User } from 'lucide-react';
import { chatService } from '../services/chatService';
import eventService from '../services/eventService';
import EventDetailModal from './EventDetailModal';

export default function AIChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content:
        "Hi! I'm your AI event assistant. I can help you find events based on your interests, budget, schedule, and more. What kind of event are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleEventClick = async (eventId) => {
    try {
      // Fetch full event details
      const details = await eventService.getEventById(eventId);
      setEventDetails(details);
      setShowEventDetail(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputMessage);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content:
          response.response ||
          response.message ||
          "I'm here to help! What would you like to know?",
        timestamp: new Date(),
        recommendedEvents: response.recommended_events || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content:
            "I'm having trouble connecting right now. Please try again in a moment!",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: 'Chat cleared! How can I help you find events today?',
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'Show me free events this week',
    'Find tech events near me',
    'What cultural events are happening?',
    'Events under $20',
    'Music festivals this month',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Event Finder</h2>
              
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[75%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className="p-2 rounded-full bg-gray-200">
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-gray-700" />
                  ) : (
                    <Bot className="h-4 w-4 text-indigo-600" />
                  )}
                </div>

                <div
                  className={`px-4 py-3 rounded-xl text-sm ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : message.isError
                      ? 'bg-red-100 text-red-800'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.recommendedEvents?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="border-t pt-3 mt-3">
                        {message.recommendedEvents.map((event, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleEventClick(event.id)}
                            className="border rounded-lg p-3 text-xs bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-md transition cursor-pointer mb-2 hover:scale-105 transform duration-200"
                          >
                            <p className="font-bold text-sm text-gray-900">{event.name}</p>
                            <div className="mt-1 space-y-1 text-gray-700">
                              <p>📅 {event.date}</p>
                              <p>📍 {event.location}</p>
                              <p>💰 {event.price}</p>
                              {event.attendees && <p>👥 Max: {event.attendees}</p>}
                            </div>
                            <div className="mt-2 text-indigo-600 font-semibold text-xs">
                              View Details →
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow">
                <Loader className="h-4 w-4 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-600">Thinking…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-2 border-t bg-white flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputMessage(q)}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-700 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about events..."
              className="flex-1 resize-none border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal 
        event={eventDetails} 
        isOpen={showEventDetail} 
        onClose={() => setShowEventDetail(false)} 
      />
    </div>
  );
}