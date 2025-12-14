import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, DollarSign, TrendingUp, LogOut, Edit, Trash2, Eye } from 'lucide-react';
import eventService from '../services/eventService';
import { authService } from '../services/authService';
import CreateEventModal from '../components/CreateEventModal';
import EventDetailModal from '../components/EventDetailModal';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated() || !user?.org_id) {
      window.location.href = '/';
      return;
    }
    fetchOrgEvents();
  }, []);

  const fetchOrgEvents = async () => {
    try {
      const response = await eventService.getEventsByOrg(user.org_id);
      setEvents(response);
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

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEventCreated = () => {
    setShowCreateModal(false);
    fetchOrgEvents();
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.event_status === 'upcoming').length;
  const completedEvents = events.filter(e => e.event_status === 'completed').length;
  const totalRevenue = events.reduce(
    (sum, e) => sum + (parseFloat(e.ticket_price) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">CampusEvents Dashboard</h1>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.name}
                {user?.is_premium && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                    PREMIUM
                  </span>
                )}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Events</h2>
            <p className="text-gray-600">Manage and track your event performance</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Events" value={totalEvents} icon={<Calendar />} />
          <StatCard label="Upcoming" value={upcomingEvents} icon={<TrendingUp />} />
          <StatCard label="Completed" value={completedEvents} icon={<Users />} />
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
                    {['Event', 'Date', 'Location', 'Status', 'Price', 'Actions'].map(h => (
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
                      <td className="px-6 py-4 flex space-x-3">
                        <button onClick={() => handleViewEvent(event)} className="text-indigo-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600">
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

      <EventDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        event={selectedEvent}
      />
    </div>
  );
}

/* Small stat card helper */
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

// import React, { useState, useEffect } from 'react';
// import { Plus, Calendar, Users, DollarSign, TrendingUp, LogOut, Edit, Trash2 } from 'lucide-react';
// import { eventService } from '../services/eventService';
// import { authService } from '../services/authService';

// export default function Dashboard() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const user = authService.getCurrentUser();

//   useEffect(() => {
//     // Redirect if not logged in or not an organization
//     if (!authService.isAuthenticated() || user?.user_type !== 'organization') {
//       window.location.href = '/';
//       return;
//     }
//     fetchOrgEvents();
//   }, []);

//   const fetchOrgEvents = async () => {
//     try {
//       const response = await eventService.getEventsByOrg(user.org_id);
//       setEvents(response);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     window.location.href = '/';
//   };

//   const totalEvents = events.length;
//   const upcomingEvents = events.filter(e => e.event_status === 'upcoming').length;
//   const completedEvents = events.filter(e => e.event_status === 'completed').length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       <nav className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-indigo-600">CampusEvents Dashboard</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">
//                 {user?.name}
//                 {user?.is_premium && (
//                   <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
//                     PREMIUM
//                   </span>
//                 )}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-gray-600 hover:text-indigo-600 transition"
//               >
//                 <LogOut className="h-5 w-5 mr-1" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Events</h2>
//             <p className="text-gray-600">Manage and track your event performance</p>
//           </div>
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Create Event
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm mb-1">Total Events</p>
//                 <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
//               </div>
//               <div className="bg-indigo-100 p-3 rounded-lg">
//                 <Calendar className="h-6 w-6 text-indigo-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm mb-1">Upcoming</p>
//                 <p className="text-3xl font-bold text-gray-900">{upcomingEvents}</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <TrendingUp className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm mb-1">Completed</p>
//                 <p className="text-3xl font-bold text-gray-900">{completedEvents}</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Users className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
//                 <p className="text-3xl font-bold text-gray-900">$0</p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-lg">
//                 <DollarSign className="h-6 w-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Events Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">Event List</h3>
//           </div>
          
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//           ) : events.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Event Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Attendees
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {events.map(event => (
//                     <tr key={event.event_id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{event.event_name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-600">
//                           {new Date(event.event_date).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-600">{event.location}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           event.event_status === 'upcoming' ? 'bg-green-100 text-green-800' :
//                           event.event_status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {event.event_status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {event.max_attendees ? `0 / ${event.max_attendees}` : 'Unlimited'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button className="text-indigo-600 hover:text-indigo-900 mr-3">
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button className="text-red-600 hover:text-red-900">
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-600 text-lg mb-4">No events created yet</p>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
//               >
//                 Create Your First Event
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Create Event Modal - Placeholder */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-xl font-bold mb-4">Create Event</h3>
//             <p className="text-gray-600 mb-4">Event creation form will be implemented here.</p>
//             <button
//               onClick={() => setShowCreateModal(false)}
//               className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }