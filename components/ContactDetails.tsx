import { useState } from 'react';
import { useLoadAction } from '@uibakery/data';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Edit2,
  Plus,
  CalendarDays,
  Clock
} from 'lucide-react';
import loadContactByIdAction from '@actions/loadContactById';
import loadDealsByContactAction from '@actions/loadDealsByContact';
import ContactForm from '@components/ContactForm';
import ActivitiesTimeline from '@components/ActivitiesTimeline';
import CreateDealSheet from '@components/CreateDealSheet';
import { Contact } from '../types/contact';
import { Deal } from '../types/deal';
import { format } from 'date-fns';
import LogActivityDialog from '@components/LogActivityDialog';

/**
 * Displays the details of a single contact along with their associated deals and activities.
 *
 * This component loads the contact and their deals from the backend using UI Bakery actions. While
 * loading, it shows skeleton placeholders. If no contact is found it renders a simple message. When
 * data is available it renders a two‑column layout: the left column shows contact metadata and
 * associated deals with an option to edit the contact or create a new deal, while the right column
 * shows a timeline of activities. Editing the contact invokes a form and refreshes the data on
 * success.
 */
type Props = {
  /** ID of the contact to display */
  contactId: string;
  /** Callback invoked when the user wants to navigate back to the contact list */
  onBack: () => void;
  /** Callback invoked when a user selects a deal to view */
  onViewDeal: (dealId: string) => void;
};

export default function ContactDetails({ contactId, onBack, onViewDeal }: Props) {
  // Load the contact record and the deals for this contact.
  const {
    data: contacts,
    loading,
    refresh: refreshContact,
  } = useLoadAction(loadContactByIdAction, [], { contactId });
  const {
    data: deals,
    refresh: refreshDeals,
  } = useLoadAction(loadDealsByContactAction, [], { contactId });
  
  console.log('ContactDetails data:', { 
    contactId, 
    loading, 
    contacts, 
    contactsType: typeof contacts,
    deals,
    dealsType: typeof deals,
    dealsIsArray: Array.isArray(deals)
  });

  // Local UI state: editing contact details or adding a new deal.
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  const [initialActivityType, setInitialActivityType] = useState<'note' | 'call' | 'meeting'>('note');

  // The contact data should be directly available
  const contact: Contact | null = contacts ? (contacts as Contact) : null;
  
  console.log('Contact data:', { contact, contacts, loading });

  /**
   * Called when the contact form successfully saves. Exits edit mode and refreshes the contact.
   */
  const handleSaveSuccess = () => {
    setIsEditing(false);
    refreshContact();
  };

  /**
   * Called when a new deal is created. Refreshes the list of deals.
   */
  const handleDealCreated = () => {
    refreshDeals();
  };

  // Render a skeleton while data is loading.
  if (loading) {
    return (
      <div className="w-full p-8 pt-24">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-blue-100 text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  // If no contact is returned, show a not‑found message.
  if (!contact) {
    return (
      <div className="w-full p-8 pt-24">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-blue-100 text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">Contact not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-8 pt-24">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-blue-100 text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Contacts
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: contact metadata and deals */}
        <div className="lg:col-span-1">
          {/* Contact details card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-white border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-1 text-slate-900">
                    {contact.first_name} {contact.last_name}
                  </CardTitle>
                  <p className="mb-6 text-slate-500">
                    {contact.company}
                    {contact.position ? ` \u00B7 ${contact.position}` : ''}
                  </p>
                  <div className="space-y-3">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-500" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-slate-500" />
                        <span>{contact.address}</span>
                      </div>
                    )}
                    {contact.position && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-slate-500" />
                        <span>{contact.position}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-500" />
                      <span>
                        Created {format(new Date(contact.created_at), 'PP')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-5 h-5 text-slate-500" />
                </Button>
              </div>
            </CardHeader>
            {/* Show either the editing form or the tag list */}
            {isEditing ? (
              <CardContent className="p-0">
                <ContactForm
                  contact={contact}
                  onCancel={() => setIsEditing(false)}
                  onSaveSuccess={handleSaveSuccess}
                />
              </CardContent>
            ) : (
              <CardContent className="p-0">
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-6 py-4">
                    {contact.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-slate-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
          {/* Deals section */}
          <div className="mt-4">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-white border-b border-slate-200 flex justify-between items-center">
                <CardTitle className="text-lg text-slate-900">Deals</CardTitle>
                <Button size="sm" onClick={() => setIsCreateDealOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {deals && Array.isArray(deals) && deals.length > 0 ? (
                  <div>
                    {(deals as Deal[]).map((deal) => (
                      <div
                        key={deal.id}
                        className="p-4 border-b last:border-none flex justify-between items-center"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{deal.title}</span>
                          <span className="text-slate-500">
                            ${deal.amount ? deal.amount.toLocaleString() : '0'}
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => onViewDeal(deal.id)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-slate-500">No deals yet.</p>
                )}
              </CardContent>
            </Card>
            {/* Slide‑over sheet for creating a new deal */}
            <CreateDealSheet
              contactId={contactId}
              open={isCreateDealOpen}
              onClose={() => setIsCreateDealOpen(false)}
              onSuccess={handleDealCreated}
            />
          </div>
        </div>
        {/* Right column: activities timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Add Note Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 justify-start px-4 border-dashed" 
                    onClick={() => {
                      setIsLoggingActivity(true);
                      setInitialActivityType('note');
                    }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add a quick note about {contact.first_name}...
                  </Button>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="secondary"
                    className="px-4 h-20"
                    onClick={() => {
                      setIsLoggingActivity(true);
                      setInitialActivityType('call');
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <Phone className="w-5 h-5 mb-1" />
                      <span className="text-xs">Log Activity</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Dialog */}
          <LogActivityDialog
            open={isLoggingActivity}
            onClose={() => {
              setIsLoggingActivity(false);
              setInitialActivityType('note');
            }}
            contactId={contactId}
            contactName={`${contact.first_name} ${contact.last_name}`}
            onSuccess={() => {
              setIsLoggingActivity(false);
              setInitialActivityType('note');
            }}
            initialType={initialActivityType}
          />
        </div>
      </div>
    </div>
  );
}