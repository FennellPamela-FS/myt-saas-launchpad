import React from 'react';
import { Route, Routes, BrowserRouter, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthorServicesPage from './pages/AuthorServicesPage';
import LaunchpadPage from './pages/LaunchpadPage';
import QuickStartPage from './pages/QuickStartPage';
import PremiumSolutionsPage from './pages/PremiumSolutionsPage';
import MytCorePage from './pages/MytCorePage';
import BookingPage from './pages/BookingPage';
import ThankYouPage from './pages/ThankYouPage';
import FeedbackPage from './pages/FeedbackPage';
import ReferralPage from './pages/ReferralPage';
import MytDevPage from './pages/MytDevPage';
import CommunityImpactPage from './pages/CommunityImpactPage';
import FaqPage from './pages/FaqPage';
import TeamPage from './pages/TeamPage';
import SolutionsHubPage from './pages/SolutionsHubPage';
import AuthorStartPaymentPage from './pages/AuthorStartPaymentPage';
import AuthorLaunchPaymentPage from './pages/AuthorLaunchPaymentPage';
import AuthorPremiumPaymentPage from './pages/AuthorPremiumPaymentPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AgencyAdminPage from './pages/AgencyAdminPage';
import './App.css';

function MainLayout() {
  return (
    <div className="app">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone route — no site header/footer */}
        <Route path="/agency-admin" element={<AgencyAdminPage />} />

        {/* All public routes wrapped in site layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={
            new URLSearchParams(window.location.search).get('payment') === 'success'
              ? <PaymentSuccessPage />
              : <HomePage />
          } />
          <Route path="/solutions-hub" element={<SolutionsHubPage />} />
          <Route path="/author-services" element={<AuthorServicesPage />} />
          <Route path="/launchpad" element={<LaunchpadPage />} />
          <Route path="/quick-start" element={<QuickStartPage />} />
          <Route path="/premium-solutions" element={<PremiumSolutionsPage />} />
          <Route path="/mytcore" element={<MytCorePage />} />
          <Route path="/book-discovery-call" element={<BookingPage />} />
          <Route path="/thank-you-discovery-call" element={<ThankYouPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/refer" element={<ReferralPage />} />
          <Route path="/mytdev" element={<MytDevPage />} />
          <Route path="/community-impact" element={<CommunityImpactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/author-start-payment" element={<AuthorStartPaymentPage />} />
          <Route path="/author-launch-payment" element={<AuthorLaunchPaymentPage />} />
          <Route path="/author-premium-payment" element={<AuthorPremiumPaymentPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;