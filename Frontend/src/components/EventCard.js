import React from 'react';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { getCategoryLabel, getCategoryColor } from '../constants/eventCategories';

export default function EventCard({ event, onClick }) {
  const isFree = event.ticket_price === 0 || !event.ticket_price;
  const eventDate = new Date(event.event_date);

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 group"
      onClick={() => onClick(event.event_id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop`}
          alt={event.event_name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.event_category || 'other')}`}>
          {getCategoryLabel(event.event_category || 'other')}
        </div>
        {/* Price Badge */}
        {isFree ? (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Free
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ${event.ticket_price}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={event.event_name}>
          {event.event_name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{eventDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="truncate" title={event.location}>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{event.max_attendees ? `${event.max_attendees} spots` : 'Unlimited'}</span>
          </div>
          <div className="flex items-center pt-2">
            <Ticket className="h-5 w-5 mr-2 text-green-600" />
            <span className={`text-base font-bold ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
              {isFree ? 'FREE' : `$${event.ticket_price}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}