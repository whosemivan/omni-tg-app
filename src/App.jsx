import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IPhoneFrame from './components/IPhoneFrame/IPhoneFrame';
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
import PhotoFeed from './components/PhotoFeed/PhotoFeed';
import AddressFeed from './components/AddressFeed/AddressFeed';
import CameraScreen from './components/CameraScreen/CameraScreen';
import FollowingList from './components/FollowingList/FollowingList';
import services from './data/services.json';
import { GUEST_PHOTOS } from './data/guestPhotos';
import { PEOPLE_PHOTOS } from './data/peoplePhotos';
import Onboarding from './components/Onboarding/Onboarding';

function MainPage({ onBook, bottomNavTab, onBottomNavChange }) {
  const [activeTab, setActiveTab] = useState('grid');
  const [showFollowing, setShowFollowing] = useState(false);

  if (bottomNavTab === 'home') {
    return (
      <>
        <Header title="НАШИ ГОСТИ" />
        <PhotoFeed photos={GUEST_PHOTOS} />
        <BottomNav activeTab={bottomNavTab} onTabChange={onBottomNavChange} />
      </>
    );
  }

  if (bottomNavTab === 'explore') {
    return (
      <>
        <Header title="ЗВУКОРЕЖИССЕРЫ" />
        <PhotoFeed photos={PEOPLE_PHOTOS} />
        <BottomNav activeTab={bottomNavTab} onTabChange={onBottomNavChange} />
      </>
    );
  }

  if (bottomNavTab === 'camera') {
    return (
      <>
        <Header title="КАМЕРА" />
        <CameraScreen />
        <BottomNav activeTab={bottomNavTab} onTabChange={onBottomNavChange} />
      </>
    );
  }

  if (bottomNavTab === 'address') {
    return (
      <>
        <Header title="АДРЕС" />
        <AddressFeed />
        <BottomNav activeTab={bottomNavTab} onTabChange={onBottomNavChange} />
      </>
    );
  }

  if (showFollowing) {
    return (
      <>
        <Header title="OMNISTUDIO" />
        <FollowingList onBack={() => setShowFollowing(false)} />
        <BottomNav activeTab={bottomNavTab} onTabChange={(tab) => { setShowFollowing(false); onBottomNavChange(tab); }} />
      </>
    );
  }

  return (
    <>
      <Header />
      <ProfileSection
        servicesCount={services.length}
        followersCount={'1M'}
        followingCount={7}
        onBook={() => onBook(null)}
        onFollowingClick={() => setShowFollowing(true)}
      />
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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [bookingService, setBookingService] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('profile');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (showOnboarding) {
      const timerId = window.setTimeout(() => {
        setShowOnboarding(false);
      }, 2000);

      return () => {
        window.clearTimeout(timerId);
      };
    }
  }, [showOnboarding]);

  const handleBook = useCallback((service) => {
    setBookingService(service || services[0]);
    setShowBooking(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setShowBooking(false);
    setBookingService(null);
  }, []);

  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <IPhoneFrame>
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
    </IPhoneFrame>
  );
}
