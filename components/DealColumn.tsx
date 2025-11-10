import { memo } from 'react';
import DealCard from './DealCard';
import type { DealWithContact } from '../types/deal';

/*
 * Renders a column in the deals board corresponding to a single stage. Contains a title and a
 * vertical list of DealCard components. When a card is clicked, the onViewDeal callback is
 * invoked with the deal id.
 */
type Props = {
  id: string;
  title: string;
  deals: DealWithContact[];
  onViewDeal: (dealId: string) => void;
  onStageChange: (dealId: string, newStage: string) => void;
};

// Column color themes for each stage
const columnThemes: Record<string, { bg: string; header: string; border: string; accent: string }> = {
  new: { 
    bg: 'bg-blue-50/80', 
    header: 'bg-blue-100 text-blue-800 border-blue-200', 
    border: 'border-blue-200',
    accent: 'bg-blue-500'
  },
  qualified: { 
    bg: 'bg-amber-50/80', 
    header: 'bg-amber-100 text-amber-800 border-amber-200', 
    border: 'border-amber-200',
    accent: 'bg-amber-500'
  },
  negotiating: { 
    bg: 'bg-orange-50/80', 
    header: 'bg-orange-100 text-orange-800 border-orange-200', 
    border: 'border-orange-200',
    accent: 'bg-orange-500'
  },
  closed_won: { 
    bg: 'bg-emerald-50/80', 
    header: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    border: 'border-emerald-200',
    accent: 'bg-emerald-500'
  },
  closed_lost: { 
    bg: 'bg-rose-50/80', 
    header: 'bg-rose-100 text-rose-800 border-rose-200', 
    border: 'border-rose-200',
    accent: 'bg-rose-500'
  },
};

function DealColumn({ id, title, deals, onViewDeal, onStageChange }: Props) {
  const theme = columnThemes[id] || columnThemes.new;
  
  return (
    <div className={`flex min-h-[500px] flex-col rounded-xl border-2 ${theme.border} ${theme.bg} backdrop-blur-sm shadow-sm`}>
      {/* Column Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-b-2 ${theme.header}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${theme.accent} shadow-sm`}></div>
          <h3 className="text-sm font-bold uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 shadow-sm">
            {deals.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 space-y-3">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              onClick={() => onViewDeal(deal.id)}
              onStageChange={onStageChange}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 py-8">
            <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center mb-3 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-slate-300"></div>
            </div>
            <p className="text-sm font-medium">No deals yet</p>
            <p className="text-xs">Deals will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(DealColumn);