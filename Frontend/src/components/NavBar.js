import React, { useState } from 'react';
import { Ticket, Menu, X } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar({ onAuthClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Ticket className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">CampusEvents</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#events" className="text-gray-700 hover:text-indigo-600 transition">Events</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600 transition">About</a>
            
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome, {user?.name}</span>
                {user?.user_type === 'organization' && (
                  <a href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition">
                    Dashboard
                  </a>
                )}
                {user?.user_type === 'user' && (
                  <a href="/events" className="text-gray-700 hover:text-indigo-600 transition">
                    My Events
                  </a>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onAuthClick('login')}
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onAuthClick('signup')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <a href="#events" className="block text-gray-700 hover:text-indigo-600">Events</a>
            <a href="#about" className="block text-gray-700 hover:text-indigo-600">About</a>
            
            {isAuthenticated ? (
              <>
                <span className="block text-gray-700">Welcome, {user?.name}</span>
                {user?.user_type === 'organization' && (
                  <a href="/dashboard" className="block text-gray-700 hover:text-indigo-600">
                    Dashboard
                  </a>
                )}
                {user?.user_type === 'user' && (
                  <a href="/events" className="block text-gray-700 hover:text-indigo-600">
                    My Events
                  </a>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onAuthClick('login')}
                  className="block w-full text-left text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onAuthClick('signup')}
                  className="block w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}