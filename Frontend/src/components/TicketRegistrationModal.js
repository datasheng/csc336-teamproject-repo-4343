import React, { useState } from 'react';
import { X, CreditCard, Calendar, MapPin, DollarSign, Lock } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';
import QRCode from 'qrcode';

export default function TicketRegistrationModal({ event, isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Confirm, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const user = authService.getCurrentUser();

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingZip: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    } 
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const generateQRCode = async (ticketId) => {
    try {
      const qrData = JSON.stringify({
        ticket_id: ticketId,
        event_id: event.event_id,
        event_name: event.event_name,
        user_id: user.user_id,
        user_name: user.name,
        timestamp: new Date().toISOString()
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#4F46E5', // Indigo
          light: '#FFFFFF'
        }
      });

      return qrCodeDataURL;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return null;
    }
  };

  const handleFreeRegistration = async () => {
    setLoading(true);
    setError('');

    try {
      // Create ticket
      const ticketResponse = await ticketService.createTicket({
        event_id: event.event_id,
        user_id: user.user_id,
        ticket_status: 'active',
        qr_code: 'pending', // Will be updated
        purchase_date: new Date().toISOString(),
        check_in_time: null,
        purchase_source: 'web'
      });

      const ticketId = ticketResponse.ticket_id;

      // Generate QR code
      const qrCode = await generateQRCode(ticketId);

      // Update ticket with QR code
      await ticketService.updateTicketStatus(ticketId, 'active');

      setGeneratedTicket({
        ticket_id: ticketId,
        qr_code: qrCode,
        event_name: event.event_name,
        event_date: event.event_date,
        location: event.location
      });

      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register for event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaidRegistration = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate payment info
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        setError('Please fill in all payment details');
        setLoading(false);
        return;
      }

      // Process payment (simulated)
      await paymentService.processPayment({
        user_id: user.user_id,
        amount: event.ticket_price,
        platform_fee: (event.ticket_price * 0.05).toFixed(2), // 5% platform fee
        payment_method: 'credit_card'
      });

      // Create ticket
      const ticketResponse = await ticketService.createTicket({
        event_id: event.event_id,
        user_id: user.user_id,
        ticket_status: 'active',
        qr_code: 'pending',
        purchase_date: new Date().toISOString(),
        check_in_time: null,
        purchase_source: 'web'
      });

      const ticketId = ticketResponse.ticket_id;

      // Generate QR code
      const qrCode = await generateQRCode(ticketId);

      setGeneratedTicket({
        ticket_id: ticketId,
        qr_code: qrCode,
        event_name: event.event_name,
        event_date: event.event_date,
        location: event.location,
        amount_paid: event.ticket_price
      });

      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!generatedTicket || !generatedTicket.qr_code) return;

    // Create a canvas with ticket design
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 800);

    // Header
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(0, 0, 600, 150);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Event Ticket', 300, 60);
    ctx.font = '20px Arial';
    ctx.fillText('CampusEvents', 300, 100);

    // Event details
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(generatedTicket.event_name, 50, 220);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#666666';
    const eventDate = new Date(generatedTicket.event_date).toLocaleString();
    ctx.fillText(`Date: ${eventDate}`, 50, 260);
    ctx.fillText(`Location: ${generatedTicket.location}`, 50, 290);
    ctx.fillText(`Ticket ID: ${generatedTicket.ticket_id}`, 50, 320);

    // QR Code
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 150, 380, 300, 300);

      // Instructions
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666666';
      ctx.fillText('Scan this QR code at the event entrance', 300, 720);

      // Download
      const link = document.createElement('a');
      link.download = `ticket_${generatedTicket.ticket_id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    qrImg.src = generatedTicket.qr_code;
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Step 1: Confirmation */}
          {step === 1 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Register for Event</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Event Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4">{event.event_name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>{new Date(event.event_date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-900 font-semibold">
                    <DollarSign className="h-5 w-5 mr-3" />
                    <span>{event.ticket_price === 0 ? 'FREE' : `$${event.ticket_price}`}</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-800">
                  <strong>Registering as:</strong> {user.name}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => event.ticket_price === 0 ? handleFreeRegistration() : setStep(2)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Processing...' : event.ticket_price === 0 ? 'Complete Registration' : 'Continue to Payment'}
                </button>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Amount Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ticket Price:</span>
                  <span className="font-semibold">${event.ticket_price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Platform Fee (5%):</span>
                  <span className="font-semibold">${(event.ticket_price * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg text-indigo-600">
                      ${(event.ticket_price * 1.05).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="billingZip"
                      value={paymentData.billingZip}
                      onChange={handleInputChange}
                      placeholder="12345"
                      maxLength="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    🔒 This is a demo payment system. Use any fake card details for testing.
                  </p>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handlePaidRegistration}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : 'Complete Purchase'}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Success with QR Code */}
          {step === 3 && generatedTicket && (
            <>
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                  <p className="text-gray-600">Your ticket has been generated</p>
                </div>

                {/* QR Code Display */}
                <div className="bg-white border-4 border-indigo-600 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-xl mb-4">{generatedTicket.event_name}</h3>
                  
                  {generatedTicket.qr_code && (
                    <img 
                      src={generatedTicket.qr_code} 
                      alt="Ticket QR Code" 
                      className="mx-auto mb-4"
                    />
                  )}

                  <div className="text-left space-y-2 bg-gray-50 rounded p-4">
                    <p className="text-sm"><strong>Ticket ID:</strong> {generatedTicket.ticket_id}</p>
                    <p className="text-sm"><strong>Date:</strong> {new Date(generatedTicket.event_date).toLocaleString()}</p>
                    <p className="text-sm"><strong>Location:</strong> {generatedTicket.location}</p>
                    {generatedTicket.amount_paid && (
                      <p className="text-sm"><strong>Amount Paid:</strong> ${generatedTicket.amount_paid}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleDownloadTicket}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-semibold"
                  >
                    Download Ticket
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      window.location.href = '/my-tickets';
                    }}
                    className="w-full border-2 border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition font-semibold"
                  >
                    View My Tickets
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full text-gray-600 py-2 hover:text-gray-900 transition"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    📧 A copy of your ticket has been sent to your email. Please bring this QR code to the event entrance.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}