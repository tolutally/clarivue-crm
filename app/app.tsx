import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Users, TrendingUp, LogOut } from 'lucide-react';
import ContactList from '@components/ContactList';
import ContactDetails from '@components/ContactDetails';
import { DealsBoardContainer } from '../components/DealsBoardContainer';
import DealDetails from '@components/DealDetails';
import ErrorBoundary from '@components/ErrorBoundary';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Auth } from '@components/Auth';
import { useMockData } from '@/lib/supabase';
import { Button } from '@components/ui/button';

type View = 'contacts' | 'contact-details' | 'deals' | 'deal-details';

function AppContent() {
  console.log('App rendering...');
  
  const [view, setView] = useState<View>('contacts');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const { user, loading, signOut } = useAuth();
  
  console.log('Current view:', view, 'selectedContactId:', selectedContactId);

  // Show loading state
  if (!useMockData && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Show auth if not in mock mode and no user
  if (!useMockData && !user) {
    return <Auth />;
  }

  const handleViewContact = useCallback((contactId: string) => {
    setSelectedContactId(contactId);
    setView('contact-details');
  }, []);

  const handleViewDeal = useCallback((dealId: string) => {
    setSelectedDealId(dealId);
    setView('deal-details');
  }, []);

  const handleBackToContacts = () => {
    setView('contacts');
    setSelectedContactId(null);
  };

  const handleBackToDeals = () => {
    setView('deals');
    setSelectedDealId(null);
  };

  const handleTabChange = (value: string) => {
    if (value === 'contacts') {
      setView('contacts');
      setSelectedContactId(null);
    } else if (value === 'deals') {
      setView('deals');
      setSelectedDealId(null);
    }
  };

  const activeTab = view === 'contacts' || view === 'contact-details' ? 'contacts' : 'deals';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200/50">
            <TabsTrigger
              value="contacts"
              className="text-slate-600 hover:bg-slate-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger
              value="deals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Deals
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {!useMockData && user && (
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>

      {view === 'contacts' && <ContactList onViewContact={handleViewContact} />}

      {view === 'contact-details' && selectedContactId && (
        <ErrorBoundary>
          <ContactDetails
            contactId={selectedContactId}
            onBack={handleBackToContacts}
            onViewDeal={handleViewDeal}
          />
        </ErrorBoundary>
      )}

      {view === 'deals' && (
        <DealsBoardContainer onViewDeal={handleViewDeal} />
      )}

      {view === 'deal-details' && selectedDealId && (
        <DealDetails
          dealId={selectedDealId}
          onBack={handleBackToDeals}
          onViewContact={handleViewContact}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;