import React, { useState } from 'react';
import { Sparkles, Users, Zap, Award, Heart, Target, ArrowRight } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { authService } from '../services/authService';

export default function AboutPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect to events page after successful login
    window.location.href = '/events';
  };

  const handleEventsClick = () => {
    window.location.href = '/';
  };

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Discovery',
      description: 'Find events in seconds with our powerful search and intelligent categorization system.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with thousands of students and discover amazing events happening around campus.'
    },
    {
      icon: Award,
      title: 'VIP Experience',
      description: 'Get early access and exclusive perks with our VIP membership program.'
    },
    {
      icon: Heart,
      title: 'Your Interests Matter',
      description: 'Get personalized event recommendations based on your preferences and interests.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500+', label: 'Events Listed' },
    { number: '100+', label: 'Campus Orgs' },
    { number: '50K+', label: 'Tickets Sold' }
  ];

  const team = [
    {
      name: 'Event Organizers',
      role: 'Make Your Mark',
      description: 'Create and manage events with powerful tools designed for campus organizations.'
    },
    {
      name: 'Event Attendees',
      role: 'Discover & Connect',
      description: 'Explore curated events, register instantly, and connect with like-minded people.'
    },
    {
      name: 'Campus Community',
      role: 'Build Together',
      description: 'We bring the campus together by creating meaningful experiences and memories.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-white">
      <Navbar onAuthClick={openAuthModal} onEventsClick={handleEventsClick} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block py-2 px-4 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-700 text-sm font-semibold mb-6">
            ✨ About Ticketr
          </span>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Campus Events</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Ticketr is the ultimate platform for discovering, creating, and attending campus events. We connect students, organizations, and communities to create unforgettable experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openAuthModal('signup')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-indigo-400/50"
            >
              Get Started
            </button>
            <button 
              onClick={handleEventsClick}
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold flex items-center justify-center gap-2"
            >
              Explore Events <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-indigo-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Ticketr, we believe that every event has the power to create lasting memories and meaningful connections. Our mission is to make event discovery and registration seamless, so students can focus on what matters—enjoying amazing experiences with friends and peers.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Whether you're looking to discover a tech workshop, music festival, or networking event, Ticketr is your one-stop platform to find, register, and share unforgettable campus moments.
            </p>
            <div className="flex items-start gap-4">
              <Target className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Empowering Campus Communities</h3>
                <p className="text-gray-600">We connect organizers and attendees to create vibrant campus ecosystems.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-10 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 text-white">
              <Sparkles className="h-24 w-24 mb-6 opacity-80" />
              <h3 className="text-3xl font-bold mb-4">Making Events Accessible</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                We believe everyone deserves easy access to amazing events. Our platform makes discovering and attending campus events as simple as a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Ticketr?</h2>
            <p className="text-xl text-gray-600">Everything you need for the perfect event experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* For Everyone Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">For Everyone</h2>
          <p className="text-xl text-gray-600">Whether you're an organizer or an attendee, Ticketr has you covered</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((role, index) => (
            <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 hover:border-indigo-300 transition">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {role.name}
              </h3>
              <p className="text-indigo-600 font-semibold mb-4">
                {role.role}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 mt-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the Community?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start discovering amazing events and connecting with your campus community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openAuthModal('signup')}
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg"
            >
              Create Account
            </button>
            <button 
              onClick={handleEventsClick}
              className="px-8 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition font-semibold"
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Community First</h3>
            <p className="text-gray-600">Building strong, vibrant campus communities</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Speed & Simplicity</h3>
            <p className="text-gray-600">Making event discovery effortless</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Excellence</h3>
            <p className="text-gray-600">Delivering outstanding experiences</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Innovation</h3>
            <p className="text-gray-600">Continuously improving the platform</p>
          </div>
        </div>
      </div>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
