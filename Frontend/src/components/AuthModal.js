import React, { useState } from 'react';
import { X, Mail, Lock, User, Building2 } from 'lucide-react';
import { authService } from '../services/authService';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [accountType, setAccountType] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    org_name: '',
    address: '',
    is_vip: false,
    is_premium: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password, accountType);
      onClose();
      
      // Redirect based on account type
      if (accountType === 'organization') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/events';
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check password match for both user and organization
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (accountType === 'organization') {
        await authService.signupOrganization({
          org_name: formData.org_name,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          is_premium: formData.is_premium
        });
      } else {
        await authService.signupUser({
          user_name: formData.user_name,
          email: formData.email,
          password: formData.password,
          is_vip: formData.is_vip
        });
      }
      onClose();
      
      // Redirect based on user type  
      if (accountType === 'organization') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/events';
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Account Type Selection for Login */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Login As
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('user')}
                    className={`p-3 rounded-lg border-2 transition ${
                      accountType === 'user'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`h-5 w-5 mx-auto mb-1 ${
                      accountType === 'user' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      accountType === 'user' ? 'text-indigo-600' : 'text-gray-600'
                    }`}>
                      Student
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('organization')}
                    className={`p-3 rounded-lg border-2 transition ${
                      accountType === 'organization'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`h-5 w-5 mx-auto mb-1 ${
                      accountType === 'organization' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      accountType === 'organization' ? 'text-indigo-600' : 'text-gray-600'
                    }`}>
                      Organization
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    placeholder="your.email@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* Signup Form */}
          {authMode === 'signup' && (
            <div>
              {/* Account Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('user')}
                    className={`p-4 rounded-lg border-2 transition ${
                      accountType === 'user'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`h-6 w-6 mx-auto mb-2 ${
                      accountType === 'user' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      accountType === 'user' ? 'text-indigo-600' : 'text-gray-600'
                    }`}>
                      Student
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('organization')}
                    className={`p-4 rounded-lg border-2 transition ${
                      accountType === 'organization'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`h-6 w-6 mx-auto mb-2 ${
                      accountType === 'organization' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      accountType === 'organization' ? 'text-indigo-600' : 'text-gray-600'
                    }`}>
                      Organization
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {accountType === 'user' ? (
                  <>
                    {/* USER SIGNUP FIELDS */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="user_name"
                          value={formData.user_name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="your.email@university.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength="6"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="Create a password (min 6 characters)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_vip"
                          checked={formData.is_vip}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          Sign up for VIP access (early bird tickets & exclusive events)
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    {/* ORGANIZATION SIGNUP FIELDS - WITH PASSWORD */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="org_name"
                          value={formData.org_name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="Student Organization Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="org.email@university.edu"
                        />
                      </div>
                    </div>

                    {/* PASSWORD FIELD FOR ORGANIZATION */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength="6"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="Create a password (min 6 characters)"
                        />
                      </div>
                    </div>

                    {/* CONFIRM PASSWORD FIELD FOR ORGANIZATION */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                        placeholder="Organization office address"
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_premium"
                          checked={formData.is_premium}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          Apply for Premium status (verified badge & priority listing)
                        </span>
                      </label>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-6 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
