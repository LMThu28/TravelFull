'use client'

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import FlightBooking from './pages/FlightBooking';
import FlightOrderList from './pages/FlightOrderList'; // Added FlightOrderList
import HotelDetail from './pages/HotelDetail';
import Hotels from './pages/Hotels';
import Services from './pages/Services';
import Recommendations from './pages/Recommendations';
import HotelSuccess from './pages/HotelSuccess';
import TourDetail from './pages/TourDetail';
import TourBookingSuccess from './pages/TourBookingSuccess'; // Import trang success
import TourBookingCancel from './pages/TourBookingCancel'; // Import trang cancel
import Tours from './pages/Tours'; // Import the new Tours page
import Chatbot from './components/Chatbot'; // Import the Chatbot component

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/flight-booking" element={<FlightBooking />} />
                <Route path="/flight-order-list" element={<FlightOrderList />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/services" element={<Services />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/hotel-success" element={<HotelSuccess />} />
                <Route path="/tour/:id" element={<TourDetail />} />
                <Route path="/tour-booking/success" element={<TourBookingSuccess />} />
                <Route path="/tour-booking/cancel" element={<TourBookingCancel />} />
            </Routes>
            <Footer />
            <Chatbot />
        </Router>
    );
}

export default App;