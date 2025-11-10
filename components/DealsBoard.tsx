import { useMemo, useState, useCallback } from 'react';
import { Button } from '@components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import DealColumn from './DealColumn';
import DealDetailSheet from './DealDetailSheet';
import DealDetailsPage from './DealDetailsPage';
import type { DealWithContact } from '../types/deal';
import updateDealStageAction from '../actions/updateDealStage';
import CreateDealSheet from './CreateDealSheet';

/*
 * Defines the stages used in the deals board. Each entry has an id matching the stage stored in
 * the database and a human readable title. You can adjust this list to add or remove stages
 * without changing the rest of the component.
 */
const STAGES = [
  { id: 'new', title: 'New' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'negotiating', title: 'Negotiating' },
  { id: 'closed_won', title: 'Closed Won' },
  { id: 'closed_lost', title: 'Closed Lost' },
];

export type DealsBoardProps = {
  deals: DealWithContact[];
  onDealUpdated: () => void;
  onViewDeal: (dealId: string) => void;
};

/**
 * A simplified Kanban style board for displaying deals grouped by stage. It fetches deals from
 * the backend and groups them client‑side. Uses dropdown selectors for stage changes instead
 * of drag and drop for better UX reliability.
 */
export default function DealsBoard({ deals, onDealUpdated, onViewDeal }: DealsBoardProps) {
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<DealWithContact | null>(null);
  const [isDealDetailOpen, setIsDealDetailOpen] = useState(false);
  const [showDetailPage, setShowDetailPage] = useState(false);
  
  const dealList: DealWithContact[] = Array.isArray(deals) ? deals : [];
  
  // Memoize each stage's deals array separately to ensure referential stability
  const newDeals = useMemo(() => dealList.filter((d) => d.stage === 'new'), [dealList]);
  const qualifiedDeals = useMemo(() => dealList.filter((d) => d.stage === 'qualified'), [dealList]);
  const negotiatingDeals = useMemo(() => dealList.filter((d) => d.stage === 'negotiating'), [dealList]);
  const closedWonDeals = useMemo(() => dealList.filter((d) => d.stage === 'closed_won'), [dealList]);
  const closedLostDeals = useMemo(() => dealList.filter((d) => d.stage === 'closed_lost'), [dealList]);

  const grouped = useMemo(() => [
    { id: 'new', title: 'New', deals: newDeals },
    { id: 'qualified', title: 'Qualified', deals: qualifiedDeals },
    { id: 'negotiating', title: 'Negotiating', deals: negotiatingDeals },
    { id: 'closed_won', title: 'Closed Won', deals: closedWonDeals },
    { id: 'closed_lost', title: 'Closed Lost', deals: closedLostDeals },
  ], [newDeals, qualifiedDeals, negotiatingDeals, closedWonDeals, closedLostDeals]);

  // Memoize the callbacks to prevent re-renders
  const stableOnViewDeal = useCallback((dealId: string) => {
    console.log('🔵 STEP 1: stableOnViewDeal called with dealId:', dealId);
    const deal = dealList.find(d => d.id === dealId);
    console.log('🔵 STEP 2: Found deal:', deal?.name);
    if (deal) {
      setSelectedDeal(deal);
      setIsDealDetailOpen(true);
      console.log('🔵 STEP 3: Setting detail sheet open');
    }
  }, [dealList]);

  const handleCloseDealDetail = useCallback(() => {
    console.log('🔴 CLOSE: Closing deal detail');
    setIsDealDetailOpen(false);
    setSelectedDeal(null);
    setShowDetailPage(false);
  }, []);

  const handleEditDeal = useCallback(() => {
    console.log('� EDIT: handleEditDeal called - switching to detail page');
    console.log('🟡 EDIT: Current selectedDeal:', selectedDeal?.name);
    console.log('🟡 EDIT: Setting showDetailPage = true');
    setIsDealDetailOpen(false);
    setShowDetailPage(true);
  }, [selectedDeal]);

  const handleBackFromDetailPage = useCallback(() => {
    console.log('🔙 BACK: Going back to deals board');
    setShowDetailPage(false);
    setSelectedDeal(null);
  }, []);

  const handleStageChange = useCallback(async (dealId: string, newStage: string) => {
    try {
      const result = await updateDealStageAction({ dealId, stage: newStage });
      console.log('✅ Deal stage updated successfully:', result);
      
      // Refresh the deals list to reflect the change
      onDealUpdated();
    } catch (error) {
      console.error('❌ Error updating deal stage:', error);
      alert('Failed to update deal stage: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [onDealUpdated]);

  const handleDealCreated = useCallback((dealId: string) => {
    setIsCreateDealOpen(false);
    onDealUpdated();
  }, [onDealUpdated]);

  // Debug logging
  console.log('🏠 RENDER: DealsBoard render state:', {
    isDealDetailOpen,
    showDetailPage,
    selectedDealName: selectedDeal?.name,
    selectedDealId: selectedDeal?.id
  });

  // Show detailed page if requested
  if (showDetailPage && selectedDeal) {
    console.log('🎯 RENDERING: DealDetailsPage for:', selectedDeal.name);
    return (
      <DealDetailsPage
        deal={selectedDeal}
        onBack={handleBackFromDetailPage}
        onEdit={() => {
          // Handle edit action here - could open edit form
          console.log('Edit deal clicked from detail page');
        }}
        onStageChange={handleStageChange}
        onDealUpdated={onDealUpdated}
      />
    );
  }

  return (
    <div className="w-full p-8 pt-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Deals Pipeline
              </h1>
              <p className="text-slate-600 mt-1">Track your deals through the sales pipeline</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsCreateDealOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 auto-rows-fr">
        {grouped.map((stage) => (
          <DealColumn
            key={stage.id}
            id={stage.id}
            title={stage.title}
            deals={stage.deals}
            onViewDeal={stableOnViewDeal}
            onStageChange={handleStageChange}
          />
        ))}
      </div>

      {/* Create Deal Sheet */}
      <CreateDealSheet
        open={isCreateDealOpen}
        onClose={() => setIsCreateDealOpen(false)}
        onSuccess={handleDealCreated}
      />

      {/* Deal Detail Sheet */}
      <DealDetailSheet
        deal={selectedDeal}
        open={isDealDetailOpen}
        onClose={handleCloseDealDetail}
        onStageChange={handleStageChange}
        onEdit={handleEditDeal}
        onDealUpdated={onDealUpdated}
      />
    </div>
  );
}