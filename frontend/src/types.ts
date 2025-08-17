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