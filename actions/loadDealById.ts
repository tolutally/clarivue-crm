import { action } from '@uibakery/data';

function loadDealById() {
  return action('loadDealById', 'SQL', {
    databaseName: 'crm_contacts_db_2',
    query: `
      SELECT
        d.id,
        d.contact_id,
        d.name,
        d.use_case,
        d.stage,
        d.signal,
        d.description,
        d.attachments,
        d.notes,
        d.created_at,
        d.updated_at,
        c.first_name as contact_first_name,
        c.last_name as contact_last_name,
        c.email as contact_email,
        c.company as contact_company
      FROM deals d
      LEFT JOIN contacts c ON d.contact_id = c.id
      WHERE d.id = {{params.dealId}}::bigint;
    `,
  });
}

export default loadDealById;