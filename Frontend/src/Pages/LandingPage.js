import React, { useState, useEffect } from 'react';
import { Search, Calendar, ArrowRight, Ticket, TrendingUp, Users } from 'lucide-react'; 
import AuthModal from '../components/AuthModal';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import eventService from '../services/eventService';
import Navbar from '../components/NavBar';


const CampusTicketLogo = () => (
  <div className="flex items-center space-x-2 text-xl font-bold text-blue-600">
    <Ticket className="h-6 w-6 text-cyan-500 fill-cyan-100" />
    <span>Ticketr</span>
  </div>
);

// Visuals
const CollegeBuzzGraphic = () => (
    <div className="relative w-full h-80 hidden lg:flex items-center justify-center p-6">
        <div className="w-64 h-64 bg-white border-4 border-indigo-400 rounded-full shadow-2xl shadow-indigo-300/60 flex items-center justify-center">
         
            <Ticket className="w-16 h-16 text-amber-500 fill-amber-100 animate-pulse" />
        </div>

        <div className="absolute top-8 left-10 w-20 h-20 bg-cyan-400/80 rounded-full flex items-center justify-center text-white shadow-lg transform rotate-6">
            <Search className="w-8 h-8" />
        </div>

        <div className="absolute bottom-10 right-0 w-24 h-24 bg-purple-500/80 rounded-xl flex items-center justify-center text-white shadow-lg transform -rotate-12">
            <Users className="w-10 h-10" />
        </div>
        
        <div className="absolute top-0 right-20 w-16 h-16 bg-red-400/80 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce duration-1000">
            <Calendar className="w-6 h-6" />
        </div>
        
        
        <svg className="absolute inset-0 w-full h-full z-0 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 20 20 Q 50 10, 80 20 T 90 60" stroke="#a5b4fc" strokeWidth="2" fill="none" className="animate-dash" strokeDasharray="5, 5" />
            <path d="M 85 85 Q 70 95, 30 90 T 15 50" stroke="#4c1d95" strokeWidth="2" fill="none" className="animate-dash" strokeDasharray="5, 5" />
        </svg>

         <style jsx>{`
            @keyframes dash {
                to {
                    stroke-dashoffset: -100;
                }
            }
            .animate-dash {
                animation: dash 5s linear infinite;
            }
        `}</style>
    </div>
);


export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      if (response) {
        const eventData = Array.isArray(response) ? response : (response.events || []);
        setEvents(eventData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleEventClick = (eventId) => {
    window.location.href = `/events/${eventId}`;
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.org_name && event.org_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory; 
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Technology', 'Cultural', 'Career', 'Music', 'Workshop', 'Art'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900"> 
      
  
      <div className="max-w-7xl mx-auto my-8 p-8 md:p-12 lg:p-16 bg-white shadow-xl rounded-3xl relative overflow-hidden">

        {/*gradients */}
        <div 
          className="absolute inset-0 z-0 opacity-60 blur-3xl md:blur-[80px]"
          style={{
            background: 'radial-gradient(circle at 10% 10%, rgba(59, 131, 246, 0.88) 0%, transparent 35%), radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.6) 0%, transparent 35%)',
            pointerEvents: 'none',
          }}
        ></div>
        

         <div 
          className="absolute inset-0 z-0 opacity-50 blur-3xl" 
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(251, 190, 36, 0.45) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        ></div>
        

         <div 
          className="absolute inset-0 z-0 opacity-50 blur-3xl" 
          style={{
            background: 'radial-gradient(circle at 0% 100%, rgba(236, 72, 154, 0.64) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        ></div>


        <div className="relative z-10">
            <Navbar onAuthClick={openAuthModal} />

            <div className="py-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
               
                <div className="text-center max-w-xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-700 text-sm font-semibold mb-4">
                         🚀 The #1 Campus Event Platform
                    </span>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                        Discover Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                            Memorable Campus Event
                        </span>
                    </h1>
                    {/*  Subtitle */}
                    <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed">
                         From tech workshops to music festivals, Ticketr connects you with the best events happening on campus right now.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        
                        <CampusTicketLogo /> 
                        
                        <div className="relative flex-grow w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-blue-100 transition-shadow">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search events, organizations, or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 text-base placeholder-gray-400 text-gray-800" 
                            />
                        </div>
                        
                        <button 
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-xl hover:shadow-blue-400 flex items-center justify-center gap-2 w-full sm:w-auto"
                            onClick={() => document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Find Events
                        </button>
                    </div>
                </div>

                {/* Graphic */}
                <div className="flex justify-center lg:justify-end">
                    <CollegeBuzzGraphic />
                </div>
            </div>
          
            <div id="events-section" className="py-16">
              

              <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Calendar className="h-7 w-7 text-cyan-500" /> 
                    Upcoming Events
                  </h2>
                  <p className="text-gray-500 text-lg">Browse the latest happenings around campus.</p>
                </div>
                
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Filter by Category</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none w-full md:w-64 px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium shadow-sm cursor-pointer"
                    >
                      {categories.map(cat => ( 
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500 font-medium animate-pulse">Fetching events...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map(event => (
                    <div key={event.event_id} className="transform transition duration-300 hover:scale-[1.02]">
                      <EventCard 
                        event={event}
                        onClick={handleEventClick}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                  <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No events found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any events matching your search or filter.
                  </p>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                    className="mt-6 text-blue-600 font-semibold hover:text-blue-500 hover:underline"
                  >
                    Clear Search and Filter
                  </button>
                </div>
              )}
            </div>
            <div className="pt-16 pb-10">
              <div className="bg-gradient-to-br from-indigo-200 via-purple-300 to-cyan-200 rounded-3xl p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 border border-indigo-300 shadow-2xl shadow-indigo-200/50">
                
                {/*  background  */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-400 opacity-20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-600 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                
                <div className="relative z-10 max-w-xl text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Launch your event in minutes.</h2>
                  <p className="text-gray-700 text-lg mb-8">
                    Organize, manage registrations, and track success with our intuitive event management tools.
                  </p>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className="bg-amber-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-lg inline-flex items-center gap-2"
                  >
                    Create Event <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                
     
                <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block w-72">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">Dashboard View</div>
                      <div className="text-gray-500 text-sm">Real-time stats</div>
                    </div>
                  </div>
    
                  <div className="h-24 w-full bg-gray-100 rounded-lg flex items-end justify-between p-2 gap-2 border border-gray-200">
                    <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 h-[40%] rounded-sm"></div>
                    <div className="w-full bg-gradient-to-t from-indigo-500 to-blue-400 h-[70%] rounded-sm"></div>
                    <div className="w-full bg-gradient-to-t from-purple-500 to-indigo-400 h-[50%] rounded-sm"></div>
                    <div className="w-full bg-gradient-to-t from-pink-500 to-purple-400 h-[85%] rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>    
            
        </div> 

      </div> 
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      <Footer />
    </div>
  );
}