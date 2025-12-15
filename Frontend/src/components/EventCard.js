import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getCategoryLabel, getCategoryColor } from '../constants/eventCategories';

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
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.event_category || 'other')}`}>
          {getCategoryLabel(event.event_category || 'other')}
        </div>
        {/* Price Badge */}
        {event.ticket_price === 0 ? (
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
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
          {event.event_name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">
              {new Date(event.event_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Max {event.max_attendees} attendees</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-500">
            Status: <span className="font-semibold text-indigo-600">{event.event_status}</span>
          </span>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}