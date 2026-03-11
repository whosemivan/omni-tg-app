import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StatusBar from './components/StatusBar/StatusBar';
import Header from './components/Header/Header';
import ProfileSection from './components/ProfileSection/ProfileSection';
import TabBar from './components/TabBar/TabBar';
import ServiceGrid from './components/ServiceGrid/ServiceGrid';
import ServiceFeed from './components/ServiceFeed/ServiceFeed';
import ServiceDetail from './components/ServiceDetail/ServiceDetail';
import BookingModal from './components/BookingModal/BookingModal';
import BottomNav from './components/BottomNav/BottomNav';
import ServiceMap from './components/ServiceMap/ServiceMap';
import GuestFeed from './components/GuestFeed/GuestFeed';
import services from './data/services.json';
import { GUEST_PHOTOS } from './data/guestPhotos';

function MainPage({ onBook, bottomNavTab, onBottomNavChange }) {
  const [activeTab, setActiveTab] = useState('grid');

  if (bottomNavTab === 'home') {
    return (
      <>
        <Header />
        <GuestFeed photos={GUEST_PHOTOS} />
        <BottomNav activeTab={bottomNavTab} onTabChange={onBottomNavChange} />
      </>
    );
  }

  return (
    <>
      <Header />
      <ProfileSection servicesCount={services.length} onBook={() => onBook(null)} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'grid' && <ServiceGrid services={services} />}
      {activeTab === 'feed' && <ServiceFeed services={services} onBook={onBook} />}
      {activeTab === 'map' && <ServiceMap />}
      <div style={{ height: 57 }} />
      <BottomNav activeTab={bottomNavTab} onTabChange={onBottomNavChange} />
    </>
  );
}

export default function App() {
  const [bookingService, setBookingService] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('profile');

  const handleBook = useCallback((service) => {
    setBookingService(service || services[0]);
    setShowBooking(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setShowBooking(false);
    setBookingService(null);
  }, []);

  return (
    <BrowserRouter>
      <StatusBar />
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              onBook={handleBook}
              bottomNavTab={bottomNavTab}
              onBottomNavChange={setBottomNavTab}
            />
          }
        />
        <Route
          path="/service/:id"
          element={<ServiceDetail onBook={handleBook} />}
        />
      </Routes>
      {showBooking && (
        <BookingModal service={bookingService} onClose={handleCloseBooking} />
      )}
    </BrowserRouter>
  );
}
