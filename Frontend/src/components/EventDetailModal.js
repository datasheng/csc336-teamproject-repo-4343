import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, MapPin, Users, DollarSign, Clock, Award } from 'lucide-react';
import { getCategoryLabel, getCategoryColor } from '../constants/eventCategories';
import TicketRegistrationModal from './TicketRegistrationModal';
import { ticketService } from '../services/ticketService';
import { authService } from '../services/authService';

export default function EventDetailModal({ event, isOpen, onClose }) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (isOpen && event && user?.user_id) {
      checkIfUserRegistered();
    }
  }, [isOpen, event, user?.user_id]);

  const checkIfUserRegistered = async () => {
    try {
      const userTickets = await ticketService.getUserTickets(user.user_id);
      const isRegisteredForEvent = userTickets.some(ticket => ticket.event_id === event.event_id);
      setIsRegistered(isRegisteredForEvent);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setIsRegistered(true);
    // You can add additional logic here like refreshing the event list
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header Image */}
          <div className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
            <img
              src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop'}
              alt={event.event_name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            
            {event.ticket_price === 0 ? (
              <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                FREE EVENT
              </div>
            ) : (
              <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full font-bold">
                ${event.ticket_price}
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Title and Status */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {event.event_name}
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    event.event_status === 'upcoming' ? 'bg-green-100 text-green-800' :
                    event.event_status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    event.event_status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.event_status?.toUpperCase()}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.event_category || 'other')}`}>
                    {getCategoryLabel(event.event_category || 'other')}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date & Time */}
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(event.event_date)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-900 font-medium">{event.location}</p>
                </div>
              </div>

              {/* Attendees */}
              {event.max_attendees && (
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Capacity</p>
                    <p className="text-gray-900 font-medium">
                      {event.max_attendees} attendees
                    </p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
                  <p className="text-gray-900 font-medium">
                    {event.ticket_price === 0 ? 'Free' : `${event.ticket_price}`}
                  </p>
                </div>
              </div>
            </div>

            {/* VIP Access */}
            {event.vip_access_time && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">VIP Early Access</h3>
                </div>
                <p className="text-sm text-yellow-800">
                  VIP members can access from: {formatDate(event.vip_access_time)}
                </p>
              </div>
            )}

            {/* Sponsor */}
            {event.is_sponsored && event.sponsor_name && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Sponsored by</p>
                <p className="text-lg font-semibold text-gray-900">{event.sponsor_name}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowRegistration(true)}
                disabled={isRegistered}
                className={`flex-1 py-3 px-6 rounded-lg transition font-semibold ${
                  isRegistered 
                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-default' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                }`}
              >
                {isRegistered ? '✓ Registered' : 'Register for Event'}
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                Share
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Event ID: {event.event_id} | 
                Organization ID: {event.org_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <TicketRegistrationModal
        event={event}
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
}
