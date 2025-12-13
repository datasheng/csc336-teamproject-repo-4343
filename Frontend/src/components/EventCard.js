import React from 'react';

const EventCard = ({ event, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onClick(event.event_id)}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.event_name}</h3>
        <p className="text-gray-600 text-sm mb-2">{event.location}</p>
        <p className="text-gray-500 text-sm mb-2">{new Date(event.event_date).toLocaleDateString()}</p>
        <p className="text-green-600 font-medium">${event.ticket_price}</p>
        {event.is_sponsored && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
            Sponsored
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;