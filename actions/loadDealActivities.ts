import { action } from '@uibakery/data';

function loadDealActivities() {
  return action('loadDealActivities', 'SQL', {
    databaseName: 'crm_contacts_db_2',
    query: `
      SELECT
        id,
        contact_id,
        deal_id,
        type,
        title,
        description,
        created_at,
        created_by
      FROM activities
      WHERE deal_id = {{params.dealId}}::bigint
      ORDER BY created_at DESC;
    `,
  });
}

export default loadDealActivities;