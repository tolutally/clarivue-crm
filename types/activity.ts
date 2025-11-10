export type Activity = {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  type: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
};