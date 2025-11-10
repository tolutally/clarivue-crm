import { useState } from 'react';
import { useLoadAction } from '@uibakery/data';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { Clock, Plus } from 'lucide-react';
import loadActivitiesAction from '@actions/loadActivities';
import LogActivityDialog from '@components/LogActivityDialog';
import ActivityItem from '@components/ActivityItem';
import type { Activity } from '@types/activity';

/**
 * Timeline component for displaying a list of activities associated with a contact.
 * This component fetches activities via the `loadActivitiesAction` and renders
 * them in a card. Users can log new activities, edit existing ones, and see
 * loading/skeleton states when data is being fetched.
 */
type Props = {
  contactId: string;
  contactName: string;
  externalTriggerOpen?: boolean;
  externalInitialType?: 'note' | 'call' | 'meeting';
  onExternalClose?: () => void;
};

function ActivitiesTimeline({ 
  contactId, 
  contactName,
  externalTriggerOpen,
  externalInitialType,
  onExternalClose
}: Props) {
  // Whether the log activity dialog is open
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  // The activity currently being edited (if any)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Load activities for this contact.  The `useLoadAction` hook comes from
  // UI Bakery's data layer and returns activities along with loading state
  // and a refresh function.
  const { data: activities, loading, refresh } =
    useLoadAction(loadActivitiesAction, [], {
      contactId: contactId,
    });

  console.log('ActivitiesTimeline:', { activities, loading });

  // Ensure we always treat activities as an array of Activity objects
  const activityList: Activity[] = Array.isArray(activities) ? activities : [];

  // Handle external trigger
  const dialogOpen = externalTriggerOpen !== undefined ? externalTriggerOpen : isLoggingActivity;

  // Called after a new activity has been logged.  This closes the dialog,
  // clears any editing state and refreshes the activities list.
  const handleActivityLogged = () => {
    setIsLoggingActivity(false);
    setEditingActivity(null);
    if (onExternalClose) {
      onExternalClose();
    }
    refresh();
  };

  // When a user chooses to edit an activity, store the activity and open
  // the logging dialog in edit mode.
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsLoggingActivity(true);
  };

  // Refresh the activities list when an activity is deleted.  Deleting
  // logic happens inside ActivityItem and calls this prop.
  const handleDelete = () => {
    refresh();
  };

  // Close the log dialog without saving.  Clear editing state.
  const handleDialogClose = () => {
    setIsLoggingActivity(false);
    setEditingActivity(null);
    if (onExternalClose) {
      onExternalClose();
    }
  };

  return (
    <>
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-slate-700" />
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Activity Timeline
              </CardTitle>
            </div>
            <Badge variant="secondary">{activityList.length}</Badge>
          </div>
          <Button onClick={() => setIsLoggingActivity(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4 px-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : activityList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No activities yet</p>
              <p className="text-sm">
                Log an activity to start tracking interactions
              </p>
            </div>
          ) : (
            <div className="relative px-6">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-purple-300" />
              <div className="space-y-8">
                {activityList.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isLast={index === activityList.length - 1}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <LogActivityDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        contactId={contactId}
        contactName={contactName}
        onSuccess={handleActivityLogged}
        editActivity={editingActivity}
        initialType={externalInitialType}
      />
    </>
  );
}

export default ActivitiesTimeline;