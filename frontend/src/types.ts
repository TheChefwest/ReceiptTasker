export type Task = {
  id: number;
  title: string;
  description: string;
  start_at: string;
  until?: string | null;
  rrule: string;
  auto_print: boolean;
  is_active: boolean;
  last_fired_at?: string | null;
};

export type TaskCreate = Omit<Task, 'id' | 'last_fired_at'>;

export type BlackoutPeriod = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
};

export type BlackoutPeriodCreate = Omit<BlackoutPeriod, 'id' | 'created_at'>;