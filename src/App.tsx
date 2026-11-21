import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SavedDrawer } from './components/layout/SavedDrawer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { PlannerPage } from './pages/PlannerPage';
import { TransitGuidePage } from './pages/TransitGuidePage';
import { PermitsPage } from './pages/PermitsPage';
import { CulturePage } from './pages/CulturePage';

const AppRouter: React.FC = () => {
  const { pathname } = useTravel();

  const renderPage = () => {
    if (pathname === '/' || pathname === '') {
      return <HomePage />;
    }
    if (pathname === '/explore') {
      return <ExplorePage />;
    }
    if (pathname.startsWith('/destination/')) {
      const slug = pathname.replace('/destination/', '').replace(/\/+$/, '');
      return <DestinationDetailPage slug={slug} />;
    }
    if (pathname === '/planner') {
      return <PlannerPage />;
    }
    if (pathname === '/transit') {
      return <TransitGuidePage />;
    }
    if (pathname === '/permits') {
      return <PermitsPage />;
    }
    if (pathname === '/culture') {
      return <CulturePage />;
    }
    return <HomePage />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#161614]">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <SavedDrawer />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppRouter />
    </TravelProvider>
  );
}
