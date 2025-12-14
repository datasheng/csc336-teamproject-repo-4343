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
    <nav className="sticky top-0 z-50 py-4"> 
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100/70 p-2">
            
            <div className="flex justify-between items-center h-12">
                
                <div className="flex items-center">
                    <Ticket className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Ticketr</span>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <a href="#events" className="text-gray-700 hover:text-cyan-500 transition">Events</a>
                    <a href="#about" className="text-gray-700 hover:text-cyan-500 transition">About</a>
                    
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            {user?.user_type === 'organization' && (
                                <a href="/dashboard" className="text-gray-700 hover:text-cyan-500 transition">
                                    Dashboard
                                </a>
                            )}
                            {user?.user_type === 'user' && (
                                <a href="/events" className="text-gray-700 hover:text-cyan-500 transition">
                                    My Events
                                </a>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-cyan-500 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => onAuthClick('login')}
                                className="text-gray-700 hover:text-cyan-500 transition"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => onAuthClick('signup')}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition shadow-md"
                            >
                                Create Account
                            </button>
                        </>
                    )}
                </div>

                {/*  menu button */}
                <button 
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6 text-cyan-500" /> : <Menu className="h-6 w-6 text-cyan-500" />}
                </button>
            </div>
        </div>
      </div>


      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t rounded-b-xl px-4 pt-2 pb-4 space-y-3 shadow-md mx-auto max-w-7xl sm:px-6 lg:px-8">
            <a href="#events" className="block text-gray-700 hover:text-cyan-500">Events</a>
            <a href="#about" className="block text-gray-700 hover:text-cyan-500">About</a>
            
            {isAuthenticated ? (
              <>
                <span className="block text-gray-700">Welcome, {user?.name}</span>
                {user?.user_type === 'organization' && (
                  <a href="/dashboard" className="block text-gray-700 hover:text-cyan-500">
                    Dashboard
                  </a>
                )}
                {user?.user_type === 'user' && (
                  <a href="/events" className="block text-gray-700 hover:text-cyan-500">
                    My Events
                  </a>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-cyan-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onAuthClick('login')}
                  className="block w-full text-left text-gray-700 hover:text-cyan-500"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onAuthClick('signup')}
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-600 text-left"
                >
                  Create Account
                </button>
              </>
            )}
        </div>
      )}
    </nav>
  );
}