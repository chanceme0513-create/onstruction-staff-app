export type StaffMember = {
  id: string;
  name: string;
  role: string;
  pin: string;
  is_manager: boolean;
  created_at: string;
};

export type DailyReport = {
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

export type Schedule = {
  id: string;
  staff_id: string;
  staff_name: string;
  schedule_date: string;
  time: string;
  title: string;
  location: string | null;
  created_at: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  posted_by: string;
  is_pinned: boolean;
  created_at: string;
};
