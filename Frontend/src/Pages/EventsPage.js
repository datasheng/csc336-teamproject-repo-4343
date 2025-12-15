import React, { useState, useEffect } from 'react';
import { Ticket, LogOut, Filter, Search, Sparkles, ArrowRight, ChevronDown } from 'lucide-react'; 
import eventService from '../services/eventService';
import { authService } from '../services/authService';
import { EVENT_CATEGORIES } from '../constants/eventCategories';
import EventDetailModal from '../components/EventDetailModal';
import AIChatButton from '../components/AiChatButton';
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
    const matchesCategory = selectedCategory === 'all' || event.event_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Ticketr</span>
            </div>
            <div className="flex items-center space-x-6">
              {user?.org_id ? (
                <a
                  href="/dashboard"
                  className="text-gray-600 hover:text-indigo-600 transition font-medium"
                >
                  Dashboard
                </a>
              ) : (
                <a
                  href="/my-tickets"
                  className="text-gray-600 hover:text-indigo-600 transition font-medium"
                >
                  My Tickets
                </a>
              )}
              <span className="text-gray-600 font-medium">
                Welcome, <span className="font-bold text-indigo-600">{user?.user_name}</span>
                {user?.is_vip ? (
                  <span className="ml-2 px-2.5 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 text-xs font-bold rounded-full">
                    ⭐ VIP
                  </span>
                ) : null}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition font-medium hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section*/}
      <div className="py-12 sm:py-20 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-40"
            style={{
                background: 'radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 40%)'
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">Discover Amazing Events</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black mb-4 text-gray-900 leading-tight">
              Your Next <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Great Experience</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Explore thousands of incredible events happening around you. Find concerts, workshops, sports events, and so much more.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by event name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-gray-900 bg-white transition"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-gray-900 bg-white cursor-pointer appearance-none transition font-medium"
                  >
                    <option value="all">All Categories</option>
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                </div>
              </div>

              {/* Selected Category Display */}
              {selectedCategory !== 'all' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Filter className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-gray-700">Filtered by:</span>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${EVENT_CATEGORIES.find(c => c.value === selectedCategory)?.color}`}>
                      {EVENT_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:bg-indigo-50 px-3 py-1 rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Events Count */}
              {filteredEvents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 font-medium">
                    Showing <span className="text-indigo-600 font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-b-indigo-600 mb-4"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading amazing events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Featured Events</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {filteredEvents.map(event => (
                <div key={event.event_id} className="transform transition hover:scale-105">
                  <EventCard
                    event={event}
                    onClick={handleEventClick}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto border border-gray-100">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 mb-6 inline-block">
                <Sparkles className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria to discover more events.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                <span>Clear Filters</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* AI Chat Button - Floating */}
      <AIChatButton />

      <Footer /> 
    </div>
  );
}