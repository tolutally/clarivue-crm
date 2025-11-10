import { memo } from 'react';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { User, Building2, Target } from 'lucide-react';
import type { DealWithContact } from '../types/deal';

/*
 * A compact representation of a deal used in the DealsBoard. Displays the deal name, stage,
 * use case, and associated contact (if any). Includes a polished stage selector dropdown
 * positioned in the top-right corner like modern CRM pipelines.
 */
type Props = {
  deal: DealWithContact;
  onClick: () => void;
  onStageChange: (dealId: string, newStage: string) => void;
};

const STAGES = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-amber-500' },
  { id: 'negotiating', title: 'Negotiating', color: 'bg-orange-500' },
  { id: 'closed_won', title: 'Closed Won', color: 'bg-emerald-500' },
  { id: 'closed_lost', title: 'Closed Lost', color: 'bg-rose-500' },
];

const signalColors: Record<'positive' | 'neutral' | 'negative', { bg: string; text: string; dot: string }> = {
  positive: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500'
  },
  neutral: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500'
  },
  negative: {
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    dot: 'bg-rose-500'
  },
};

function DealCard({ deal, onClick, onStageChange }: Props) {
  const handleStageChange = (newStage: string) => {
    onStageChange(deal.id, newStage);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on the select dropdown
    if ((e.target as HTMLElement).closest('[data-stage-selector]')) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  const signalStyle = signalColors[deal.signal];

  return (
    <Card 
      onClick={handleCardClick}
      className="group cursor-pointer hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 border border-slate-200 bg-white hover:scale-[1.02] hover:-translate-y-1 !overflow-visible"
    >
      <CardHeader className="p-4 pb-3">
        {/* Header: Deal title (left) + Stage dropdown (right) */}
        <div className="flex justify-between items-start gap-2">
          {/* Deal Title - truncated to prevent overlap */}
          <h3 className="text-lg font-semibold text-slate-900 leading-tight group-hover:text-slate-800 transition-colors line-clamp-2 flex-1 pr-2">
            {deal.name}
          </h3>
          
          {/* Icon-only stage selector */}
          <div data-stage-selector className="shrink-0 relative">
            <Select value={deal.stage} onValueChange={handleStageChange}>
              <SelectTrigger 
                className="h-8 w-8 p-0 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-150 [&>svg]:h-4 [&>svg]:w-4"
                aria-label="Change deal stage"
              >
                {/* icon-only trigger; chevron comes from Select by default */}
              </SelectTrigger>

              <SelectContent className="right-0 w-[140px]">
                {STAGES.map((stage) => (
                  <SelectItem 
                    key={stage.id} 
                    value={stage.id}
                    className="text-sm py-2 px-3 hover:bg-slate-50 focus:bg-slate-50 rounded-md mx-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                      <span>{stage.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Signal indicator badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${signalStyle.bg}`}>
          <div className={`w-2 h-2 rounded-full ${signalStyle.dot} shadow-sm`}></div>
          <span className={`text-xs font-medium uppercase tracking-wide ${signalStyle.text}`}>
            {deal.signal}
          </span>
        </div>

        {/* Use case / description */}
        <div className="flex items-start gap-2">
          <Target className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-2">
            {deal.use_case}
          </p>
        </div>

        {/* Contact information */}
        {deal.contact_first_name && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <User className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {deal.contact_first_name} {deal.contact_last_name}
              </p>
              {deal.contact_company && (
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <p className="text-xs text-slate-500 truncate">
                    {deal.contact_company}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(DealCard);