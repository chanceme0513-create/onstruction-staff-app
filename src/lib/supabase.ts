import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export type DailyReportRow = {
  id: string;
  staff_id: string;
  staff_name: string;
  submitted_at: string;
  site_name: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  score_health: number;
  score_progress: number;
  score_teamwork: number;
  score_safety: number;
  score_motivation: number;
  avg_score: number;
  thanks_sent_to: string | null;
  thanks_tag: string | null;
  thanks_message: string | null;
  note: string | null;
  report_date: string;
};
