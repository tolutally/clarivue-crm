import { action } from '@uibakery/data';

function createActivity() {
  return action('createActivity', 'SQL', {
    databaseName: 'crm_contacts_db_2',
    query: `
      INSERT INTO activities (contact_id, deal_id, type, title, description, created_by)
      VALUES (
        {{ params.contactId }}::bigint,
        {{ params.dealId }}::bigint,
        {{ params.type }},
        {{ params.title }},
        {{ params.description }},
        {{ params.createdBy }}
      );
    `,
  });
}

export default createActivity;