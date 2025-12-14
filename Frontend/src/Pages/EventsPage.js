import React, { useState, useEffect } from 'react';
import { Calendar, LogOut, Search } from 'lucide-react'; 
import eventService from '../services/eventService';
import { authService } from '../services/authService';
import EventDetailModal from '../components/EventDetailModal';
import EventCard from '../components/EventCard'; 
import Footer from '../components/Footer';     


export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/';
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      if (Array.isArray(response)) {
        setEvents(response);
      } else {
        console.error('Failed to fetch events: invalid response format');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  const handleEventClick = (eventId) => {
    const event = events.find(e => e.event_id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Technology', 'Cultural', 'Career', 'Music', 'Workshop', 'Art'];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Ticketr</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.org_id ? (
                <a
                  href="/dashboard"
                  className="text-gray-600 hover:text-indigo-600 transition"
                >
                  Dashboard
                </a>
              ) : (
                <a
                  href="/my-tickets"
                  className="text-gray-600 hover:text-indigo-600 transition"
                >
                  My Tickets
                </a>
              )}
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user?.org_name || user?.user_name}</span>
                {user?.is_vip && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                    VIP
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section*/}
      <div className="py-16 sm:py-24 mb-12 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-80 z-0 pointer-events-none"
            style={{
                background: 'radial-gradient(circle at 10% 10%, rgba(70, 72, 218, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(236, 110, 20, 0.08) 0%, transparent 40%)'
            }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-gray-900">
            Find Your Next Great Experience
          </h2>
          <p className="text-xl sm:text-2xl mb-8 font-light text-gray-600">
            Discover thousands of campus events, concerts, workshops, and more.
          </p>

          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by event name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-gray-900 bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Categories */}
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore by Category</h2>
            <div className="flex flex-wrap gap-3">
                {categories.filter(c => c !== 'all').map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
    
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === 'all'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    All Events
                </button>
            </div>
        </div>

        {/* Events */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard
                key={event.event_id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer /> 
    </div>
  );
}