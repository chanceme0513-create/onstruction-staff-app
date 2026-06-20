-- Supabase SQL Editor にそのまま貼り付けて実行してください

-- 日報テーブル
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
  note text,
  report_date date DEFAULT current_date
);

-- 誰でも読み書きできるようにする（デモ用・認証なし）
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でも閲覧できる" ON daily_reports
  FOR SELECT USING (true);

CREATE POLICY "誰でも投稿できる" ON daily_reports
  FOR INSERT WITH CHECK (true);
