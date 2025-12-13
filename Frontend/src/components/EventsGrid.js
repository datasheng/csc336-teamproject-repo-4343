import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function EventCard({ event, onClick }) {
  return (
    <div 
      onClick={() => onClick(event.event_id)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop`}
          alt={event.event_name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-indigo-600">
          {event.category || 'Event'}
        </div>
        {event.ticket_price === 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Free
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
          {event.event_name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {new Date(event.event_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.attendees || 0} attending</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-2xl font-bold text-gray-900">
            {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
          </span>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}// import React, { useState, useEffect } from 'react';

// const EventsGrid = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/events')
//       .then(res => res.json())
//       .then(data => setEvents(data))
//       .catch(() => console.log("Backend not running"));
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Events</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
//         {events.map(event => (
//           <div key={event.event_id} style={{ border: '1px solid #ccc', padding: '10px' }}>
//             <h3>{event.event_name}</h3>
//             <p>Date: {event.event_date}</p>
//             <p>Location: {event.location}</p>
//             <p>Price: ${event.ticket_price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EventsGrid;