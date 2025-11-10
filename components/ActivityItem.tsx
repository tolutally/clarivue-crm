import { useState } from 'react';
import { useMutateAction } from '@uibakery/data';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  UserCheck,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Activity } from '../types/activity';
import { format } from 'date-fns';
import deleteActivityAction from '@actions/deleteActivity';

/**
 * Render a single activity entry in a timeline.  Shows the activity
 * type, title, date, optional description and author, and provides
 * buttons to edit or delete the entry.  Deletion uses the
 * `deleteActivityAction` mutation from UI Bakery.
 */
type Props = {
  activity: Activity;
  isLast: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: () => void;
};

// Map activity types to icon components
const activityIcons: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  message: MessageSquare,
  default: UserCheck,
};

// Map activity types to coloured badge classes
const activityColors: Record<string, string> = {
  call: 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border-green-300 shadow-sm',
  email: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 border-blue-300 shadow-sm',
  meeting: 'bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700 border-purple-300 shadow-sm',
  note: 'bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 border-amber-300 shadow-sm',
  message: 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 border-pink-300 shadow-sm',
  default: 'bg-gradient-to-br from-slate-100 to-gray-100 text-slate-700 border-slate-300 shadow-sm',
};

function ActivityItem({ activity, isLast, onEdit, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteActivity] = useMutateAction(deleteActivityAction);

  // Choose the appropriate icon and colour based on the activity type
  const IconComponent =
    activityIcons[activity.type as keyof typeof activityIcons] || activityIcons.default;
  const colorClass =
    activityColors[activity.type as keyof typeof activityColors] || activityColors.default;

  // Prompt for confirmation before deleting and call the mutation
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setIsDeleting(true);
      await deleteActivity({ activityId: activity.id.toString() });
      onDelete();
    }
  };

  return (
    <div className={`relative pl-14 ${!isLast ? 'pb-8' : ''}`}>
      <div
        className={`absolute left-4 w-8 h-8 rounded-full border flex items-center justify-center ${colorClass}`}
      >
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all hover:border-indigo-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium text-slate-900 truncate">{activity.title}</h3>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${
                  activity.type === 'call'
                    ? 'border-green-300 text-green-700 bg-green-50'
                    : activity.type === 'email'
                    ? 'border-blue-300 text-blue-700 bg-blue-50'
                    : activity.type === 'meeting'
                    ? 'border-purple-300 text-purple-700 bg-purple-50'
                    : activity.type === 'note'
                    ? 'border-amber-300 text-amber-700 bg-amber-50'
                    : activity.type === 'message'
                    ? 'border-pink-300 text-pink-700 bg-pink-50'
                    : 'border-slate-300 text-slate-700 bg-slate-50'
                }`}
              >
                {activity.type}
              </Badge>
            </div>
            {activity.description && (
              <div className="prose prose-sm max-w-none text-slate-600 mb-2">
                {activity.description}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3">
              <p className="text-xs text-slate-500">
                {format(new Date(activity.created_at), 'PPp')}
              </p>
              {activity.created_by && (
                <>
                  <span className="text-xs text-slate-300">•</span>
                  <p className="text-xs text-slate-500">
                    by {activity.created_by}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(activity)}
              className="h-8 w-8 p-0 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;