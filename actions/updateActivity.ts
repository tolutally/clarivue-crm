import { action } from '@uibakery/data';

function updateActivity() {
  return action('updateActivity', 'SQL', {
    databaseName: 'crm_contacts_db_2',
    query: `
      UPDATE activities
      SET
        type = {{ params.type }},
        title = {{ params.title }},
        description = {{ params.description }},
        created_at = {{ params.activityDate }}::timestamptz
      WHERE id = {{ params.activityId }}::bigint;
    `,
  });
}

export default updateActivity;