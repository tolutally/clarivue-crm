import { supabase, useMockData } from '../lib/supabase';

let mockActivityIdCounter = 100;
let mockActivities: any[] = [];

async function createActivity({
  contact_id,
  deal_id,
  type,
  title,
  description,
  created_at,
}: {
  contact_id: string | null;
  deal_id: string | null;
  type: string;
  title: string;
  description?: string;
  created_by?: string; // Accept but ignore for compatibility
  created_at?: string;
}) {
  console.log('createActivity called with:', { contact_id, deal_id, type, title, description, created_at });
  console.log('useMockData:', useMockData);
  
  if (useMockData) {
    console.log('Creating mock activity');
    const newActivity = {
      id: String(mockActivityIdCounter++),
      contact_id,
      deal_id,
      type,
      title,
      description: description || null,
      created_at: created_at || new Date().toISOString(),
    };
    
    mockActivities.push(newActivity);
    console.log('Mock activity created:', newActivity);
    return [newActivity];
  }

  console.log('Using Supabase - creating activity in database...');

  const activityData: any = {
    type,
    title,
    description: description || null,
  };

  // Add contact_id or deal_id
  if (contact_id) {
    activityData.contact_id = contact_id;
  }
  if (deal_id) {
    activityData.deal_id = deal_id;
  }

  // Add created_at if provided
  if (created_at) {
    activityData.created_at = created_at;
  }

  console.log('Inserting activity into Supabase:', activityData);

  const { data, error } = await supabase
    .from('activities')
    .insert(activityData)
    .select();

  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }

  console.log('✅ Successfully created activity in Supabase:', data);
  return data;
}

export default createActivity;