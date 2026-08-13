-- Supabase SQL Editor にそのまま貼り付けて実行してください

-- ===== 日報テーブル =====
CREATE TABLE IF NOT EXISTS daily_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id text NOT NULL,
  staff_name text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  site_name text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  hours_worked numeric DEFAULT 0,
  score_health int NOT NULL CHECK (score_health BETWEEN 1 AND 5),
  score_progress int NOT NULL CHECK (score_progress BETWEEN 1 AND 5),
  score_teamwork int NOT NULL CHECK (score_teamwork BETWEEN 1 AND 5),
  score_safety int NOT NULL CHECK (score_safety BETWEEN 1 AND 5),
  score_motivation int NOT NULL CHECK (score_motivation BETWEEN 1 AND 5),
  avg_score numeric NOT NULL,
  thanks_sent_to text,
  thanks_tag text,
  thanks_message text,
  note text,
  report_date date DEFAULT current_date
);

-- thanks_message カラムが未追加の場合は追加（既存DBへの追加）
ALTER TABLE daily_reports ADD COLUMN IF NOT EXISTS thanks_message text;

ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でも閲覧できる" ON daily_reports
  FOR SELECT USING (true);

CREATE POLICY "誰でも投稿できる" ON daily_reports
  FOR INSERT WITH CHECK (true);

-- 日報の編集を許可（修正機能のために必要）
CREATE POLICY "誰でも更新できる" ON daily_reports
  FOR UPDATE USING (true);


-- ===== チームスケジュールテーブル =====
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id text NOT NULL,
  staff_name text NOT NULL,
  schedule_date date NOT NULL,
  time text NOT NULL DEFAULT '終日',
  title text NOT NULL,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でも閲覧できる" ON schedules
  FOR SELECT USING (true);

CREATE POLICY "誰でも投稿できる" ON schedules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "誰でも更新できる" ON schedules
  FOR UPDATE USING (true);

CREATE POLICY "誰でも削除できる" ON schedules
  FOR DELETE USING (true);
