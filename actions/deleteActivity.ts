import { action } from '@uibakery/data';

function deleteActivity() {
  return action('deleteActivity', 'SQL', {
    databaseName: 'crm_contacts_db_2',
    query: `
      DELETE FROM activities
      WHERE id = {{ params.activityId }}::bigint;
    `,
  });
}

export default deleteActivity;