import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar, Users, DollarSign, TrendingUp, LogOut, Edit, Trash2, Eye, Download } from 'lucide-react';
import eventService from '../services/eventService';
import { ticketService } from '../services/ticketService';
import { authService } from '../services/authService';
import { excelService } from '../services/excelService';
import CreateEventModal from '../components/CreateEventModal';
import EditEventModal from '../components/EditEventModal';
import EventStatsModal from '../components/EventStatsModal';

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
        {icon}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const user = authService.getCurrentUser();

  
  const fetchOrgEvents = useCallback(async () => {
    try {
      const response = await eventService.getEventsByOrg(user.org_id);
      
      let totalReg = 0;
      let totalRev = 0;
      
      const eventsWithRegistrations = await Promise.all(
        response.map(async (event) => {
          try {
            const tickets = await ticketService.getEventTickets(event.event_id);
            const registrationCount = tickets.length;
            totalReg += registrationCount;
            
          
            if (event.ticket_price > 0) {
              totalRev += event.ticket_price * registrationCount;
            }
            
            return {
              ...event,
              registrationCount
            };
          } catch (error) {
            console.error(`Error fetching tickets for event ${event.event_id}:`, error);
            return {
              ...event,
              registrationCount: 0
            };
          }
        })
      );
      
      setEvents(eventsWithRegistrations);
      setTotalRegistrations(totalReg);
      setTotalRevenue(totalRev);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [user.org_id]);

  useEffect(() => {
    if (!authService.isAuthenticated() || !user?.org_id) {
      window.location.href = '/';
      return;
    }
    fetchOrgEvents();
  }, [fetchOrgEvents, user?.org_id]); 

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowStatsModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleEventCreated = () => {
    setShowCreateModal(false);
    fetchOrgEvents();
  };

  const handleEventUpdated = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
    fetchOrgEvents();
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await eventService.deleteEvent(eventId);
      console.log('Delete response:', response);
      
      setEvents(events.filter(e => e.event_id !== eventId));
    
      fetchOrgEvents();
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Error: ' + (error.message || error));
    }
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.event_status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Ticketr</h1>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user?.org_name && user?.org_name !== '0' ? user?.org_name : 'Organization'}</span>
                {user?.is_premium ? (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                    PREMIUM
                  </span>
                ) : null}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Events</h2>
            <p className="text-gray-600">Manage and track your event performance</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => excelService.generateRevenueReport(user.org_name, events, totalRegistrations, totalRevenue)}
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Events" value={totalEvents} icon={<Calendar />} />
          <StatCard label="Registrations" value={totalRegistrations} icon={<Users />} />
          <StatCard label="Upcoming" value={upcomingEvents} icon={<TrendingUp />} />
          <StatCard label="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<DollarSign />} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Event List</h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Event', 'Date', 'Location', 'Status', 'Price', 'Registrations', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {events.map(event => (
                    <tr key={event.event_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{event.event_name}</td>
                      <td className="px-6 py-4">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{event.location}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100">
                          {event.event_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {event.registrationCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex space-x-3">
                        <button onClick={() => handleViewEvent(event)} className="text-indigo-600 hover:text-indigo-800 transition">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.event_id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No events created yet
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />

      <EditEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        event={selectedEvent}
        onEventUpdated={handleEventUpdated}
      />

      <EventStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        event={selectedEvent}
      />
    </div>
  );
}