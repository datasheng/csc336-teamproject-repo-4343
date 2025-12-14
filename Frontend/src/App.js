import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import EventsPage from './Pages/EventsPage';
import Dashboard from './Pages/Dashboard';
import LandingPage from "./Pages/LandingPage";
import MyTicketsPage from './Pages/MyTicketsPage';

import "./App.css";
import './index.css';

function App() {
  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        
    
      </Routes>
    </Router>
  );
}

export default App;
