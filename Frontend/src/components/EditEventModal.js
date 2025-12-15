import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, DollarSign, Users, Clock } from 'lucide-react';
import eventService from '../services/eventService';
import { authService } from '../services/authService';
import { EVENT_CATEGORIES } from '../constants/eventCategories';

export default function EditEventModal({ isOpen, onClose, event, onEventUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    location: '',
    max_attendees: '',
    ticket_price: '',
    event_category: 'other',
    sponsor_name: '',
    is_sponsored: false,
    vip_access_time: '',
    general_access_time: '',
    event_status: 'upcoming'
  });

  useEffect(() => {
    if (event && isOpen) {
      setFormData({
        event_name: event.event_name || '',
        event_date: event.event_date ? event.event_date.slice(0, 16) : '',
        location: event.location || '',
        max_attendees: event.max_attendees || '',
        ticket_price: event.ticket_price || '',
        event_category: event.event_category || 'other',
        sponsor_name: event.sponsor_name || '',
        is_sponsored: event.is_sponsored || false,
        vip_access_time: event.vip_access_time ? event.vip_access_time.slice(0, 16) : '',
        general_access_time: event.general_access_time ? event.general_access_time.slice(0, 16) : '',
        event_status: event.event_status || 'upcoming'
      });
    }
  }, [event, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.event_name || !formData.event_date || !formData.location) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const eventData = {
        org_id: user.org_id,
        event_name: formData.event_name,
        event_date: formData.event_date,
        location: formData.location,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        ticket_price: parseFloat(formData.ticket_price) || 0,
        event_category: formData.event_category,
        sponsor_name: formData.sponsor_name || null,
        is_sponsored: formData.is_sponsored,
        vip_access_time: formData.vip_access_time || null,
        general_access_time: formData.general_access_time || null,
        event_status: formData.event_status
      };

      await eventService.updateEvent(event.event_id, eventData);

      setFormData({
        event_name: '',
        event_date: '',
        location: '',
        max_attendees: '',
        ticket_price: '',
        event_category: 'other',
        sponsor_name: '',
        is_sponsored: false,
        vip_access_time: '',
        general_access_time: '',
        event_status: 'upcoming'
      });

      onClose();
      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      setError(err.message || 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Enter event name"
              required
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date & Time *</label>
            <input
              type="datetime-local"
              name="event_date"
              value={formData.event_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Enter event location"
              required
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Max Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
              <input
                type="number"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Ticket Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price ($)</label>
              <input
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Event Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Category *</label>
            <select
              name="event_category"
              value={formData.event_category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {EVENT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Event Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Status</label>
            <select
              name="event_status"
              value={formData.event_status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sponsor */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_sponsored"
                checked={formData.is_sponsored}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">This event is sponsored</span>
            </label>
          </div>

          {formData.is_sponsored && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Name</label>
              <input
                type="text"
                name="sponsor_name"
                value={formData.sponsor_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="Enter sponsor name"
              />
            </div>
          )}

          {/* Access Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VIP Access Time</label>
              <input
                type="datetime-local"
                name="vip_access_time"
                value={formData.vip_access_time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">General Access Time</label>
              <input
                type="datetime-local"
                name="general_access_time"
                value={formData.general_access_time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
