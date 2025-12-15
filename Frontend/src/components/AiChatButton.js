import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AIChatModal from './AiChatModal';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        aria-label="Open AI Event Finder"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-6 right-24 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-40 animate-bounce">
          Ask AI to find events!
        </div>
      )}

      {/* Chat Modal */}
      <AIChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}