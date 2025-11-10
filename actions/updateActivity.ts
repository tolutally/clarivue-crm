import { supabase, useMockData } from '../lib/supabase';

async function updateActivity({
  id,
  type,
  title,
  description,
  created_at,
}: {
  id: string;
  type: string;
  title: string;
  description?: string;
  created_at?: string;
}) {
  console.log('updateActivity called with:', { id, type, title, description, created_at });
  
  if (useMockData) {
    console.log('Updating mock activity - not implemented');
    return [];
  }

  const updateData: any = {
    type,
    title,
    description: description || null,
  };

  if (created_at) {
    updateData.created_at = created_at;
  }

  const { data, error } = await supabase
    .from('activities')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }

  console.log('✅ Successfully updated activity:', data);
  return data;
}

export default updateActivity;