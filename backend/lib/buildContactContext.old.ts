import { supabase } from './supabase';

export interface ContactContext {
  contact: any;
  deals: any[];
  activities: any[];
}

export async function buildContactContext(contactId: string): Promise<string> {
  console.log('🔍 Building context for contact:', contactId);
  try {
    // Fetch contact details
    console.log('📞 Fetching contact from database...');
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError) {
      console.error('❌ Contact fetch error:', contactError);
      throw contactError;
    }
    if (!contact) {
      console.error('❌ Contact not found for ID:', contactId);
      throw new Error('Contact not found');
    }
    console.log('✅ Contact found:', contact.name);
    console.log('✅ Contact found:', contact.name);

    // Fetch related deals
    console.log('💼 Fetching deals for contact...');
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (dealsError) {
      console.error('❌ Deals fetch error:', dealsError);
      throw dealsError;
    }
    console.log(`✅ Found ${deals?.length || 0} deals`);

    // Fetch recent activities
    console.log('📋 Fetching activities for contact...');
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (activitiesError) {
      console.error('❌ Activities fetch error:', activitiesError);
      throw activitiesError;
    }
    console.log(`✅ Found ${activities?.length || 0} activities`);
    console.log(`✅ Found ${activities?.length || 0} activities`);

    // Build context string
    console.log('📝 Building context string...');
    const contextParts = [
      `Contact: ${contact.name}`,
      `Email: ${contact.email || 'Not provided'}`,
      `Phone: ${contact.phone || 'Not provided'}`,
      `Company: ${contact.company || 'Not provided'}`,
      ``,
      `Deals (${deals?.length || 0}):`,
      ...(deals || []).map((deal: any) => 
        `- ${deal.title}: $${deal.value} (${deal.stage})`
      ),
      ``,
      `Recent Activities (${activities?.length || 0}):`,
      ...(activities || []).slice(0, 10).map((activity: any) => 
        `- [${activity.type}] ${new Date(activity.created_at).toLocaleDateString()}: ${activity.description || 'No description'}`
      )
    ];

    const context = contextParts.join('\n');
    console.log(`✅ Context built successfully (${context.length} characters)`);
    return context;
  } catch (error) {
    console.error('❌ Error building contact context:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to build contact context: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
