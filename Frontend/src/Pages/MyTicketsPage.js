import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, MapPin, Download, LogOut, QrCode, X } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import eventService from '../services/eventService';
import { authService } from '../services/authService';
import QRCode from 'qrcode';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated() || user?.org_id) {
      window.location.href = '/';
      return;
    }
    fetchUserTickets();
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      const ticketsResponse = await ticketService.getUserTickets(user.user_id);
      
      // Fetch event details for each ticket
      const ticketsWithEvents = await Promise.all(
        ticketsResponse.map(async (ticket) => {
          try {
            const event = await eventService.getEventById(ticket.event_id);
            return { ...ticket, event };
          } catch (err) {
            return { ...ticket, event: null };
          }
        })
      );

      setTickets(ticketsWithEvents);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  const generateQRCode = async (ticket) => {
    try {
      const qrData = JSON.stringify({
        ticket_id: ticket.ticket_id,
        event_id: ticket.event_id,
        event_name: ticket.event?.event_name,
        user_id: user.user_id,
        user_name: user.name,
        timestamp: new Date().toISOString()
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#4F46E5',
          light: '#FFFFFF'
        }
      });

      return qrCodeDataURL;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return null;
    }
  };

  const handleViewQR = async (ticket) => {
    const qrCode = await generateQRCode(ticket);
    setSelectedTicket({ ...ticket, qr_code: qrCode });
    setShowQRModal(true);
  };

  const handleDownloadTicket = async (ticket) => {
    const qrCode = await generateQRCode(ticket);
    if (!qrCode) return;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 800);

    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(0, 0, 600, 150);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Event Ticket', 300, 60);
    ctx.font = '20px Arial';
    ctx.fillText('CampusEvents', 300, 100);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(ticket.event?.event_name || 'Event', 50, 220);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Date: ${new Date(ticket.event?.event_date).toLocaleString()}`, 50, 260);
    ctx.fillText(`Location: ${ticket.event?.location}`, 50, 290);
    ctx.fillText(`Ticket ID: ${ticket.ticket_id}`, 50, 320);

    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 100, 380, 400, 400);

      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666666';
      ctx.fillText('Scan this QR code at the event entrance', 300, 720);

      const link = document.createElement('a');
      link.download = `ticket_${ticket.ticket_id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    qrImg.src = qrCode;
  };

  const upcomingTickets = tickets.filter(t => 
    t.event && new Date(t.event.event_date) > new Date() && t.ticket_status === 'active'
  );
  const pastTickets = tickets.filter(t => 
    t.event && new Date(t.event.event_date) <= new Date() || t.ticket_status === 'used'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">My Tickets</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/events" className="text-gray-700 hover:text-indigo-600 transition">
                Browse Events
              </a>
              <span className="text-gray-700">
                {user?.name}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading your tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Yet</h3>
            <p className="text-gray-600 mb-6">You haven't registered for any events</p>
            <a
              href="/events"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <>
            {/* Upcoming Tickets */}
            {upcomingTickets.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTickets.map(ticket => (
                    <div key={ticket.ticket_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                        <h3 className="text-white font-bold text-lg">{ticket.event?.event_name}</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {new Date(ticket.event?.event_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{ticket.event?.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <TicketIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm">ID: {ticket.ticket_id}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewQR(ticket)}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold flex items-center justify-center"
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            View QR
                          </button>
                          <button
                            onClick={() => handleDownloadTicket(ticket)}
                            className="flex-1 border-2 border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50 transition text-sm font-semibold flex items-center justify-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Tickets */}
            {pastTickets.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTickets.map(ticket => (
                    <div key={ticket.ticket_id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                      <div className="bg-gray-400 p-4">
                        <h3 className="text-white font-bold text-lg">{ticket.event?.event_name}</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {new Date(ticket.event?.event_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{ticket.event?.location}</span>
                          </div>
                          <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            {ticket.ticket_status === 'used' ? 'Attended' : 'Expired'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Your Ticket</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-xl mb-4">{selectedTicket.event?.event_name}</h4>
              
              {selectedTicket.qr_code && (
                <div className="bg-white border-4 border-indigo-600 rounded-lg p-4 mb-4">
                  <img 
                    src={selectedTicket.qr_code} 
                    alt="Ticket QR Code" 
                    className="mx-auto"
                  />
                </div>
              )}

              <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2"><strong>Ticket ID:</strong> {selectedTicket.ticket_id}</p>
                <p className="text-sm mb-2"><strong>Date:</strong> {new Date(selectedTicket.event?.event_date).toLocaleString()}</p>
                <p className="text-sm"><strong>Location:</strong> {selectedTicket.event?.location}</p>
              </div>

              <button
                onClick={() => handleDownloadTicket(selectedTicket)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}