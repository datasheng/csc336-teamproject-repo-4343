import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { ticketService } from '../services/ticketService';

export default function EventStatsModal({ event, isOpen, onClose }) {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && event) {
      fetchRegisteredUsers();
    }
  }, [isOpen, event]);

  const fetchRegisteredUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const tickets = await ticketService.getEventTickets(event.event_id);
      setRegisteredUsers(tickets);
    } catch (err) {
      setError('Failed to fetch registered users');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const seatsRemaining = event.max_attendees ? event.max_attendees - registeredUsers.length : null;
  const occupancyRate = event.max_attendees ? ((registeredUsers.length / event.max_attendees) * 100).toFixed(1) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">{event.event_name}</h2>
            <p className="text-indigo-100 text-sm mt-1">Event Statistics & Registrations</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Registrations */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Registrations</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{registeredUsers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600 opacity-50" />
              </div>
            </div>

            {/* Seats Remaining */}
            {event.max_attendees && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Seats Remaining</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{seatsRemaining}</p>
                    <p className="text-xs text-gray-500 mt-2">of {event.max_attendees} total</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
                </div>
              </div>
            )}

            {/* Occupancy Rate */}
            {occupancyRate && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Occupancy Rate</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">{occupancyRate}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-sm">{occupancyRate}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">{new Date(event.event_date).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{event.location}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-gray-900 capitalize">{event.event_status}</p>
              </div>
              <div>
                <p className="text-gray-600">Ticket Price</p>
                <p className="font-medium text-gray-900">{event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}</p>
              </div>
            </div>
          </div>

          {/* Registered Users */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Registered Users</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            ) : registeredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Registered On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {registeredUsers.map((ticket, index) => (
                      <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {ticket.user?.user_name || 'Unknown User'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {ticket.user?.email || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.ticket_status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : ticket.ticket_status === 'used'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.ticket_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(ticket.purchase_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No registrations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
