export interface Task{
    id:number;
    title:string;
    description:string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'completed';
    due_date: string | null;
    created_at: string;
    updated_at: string;
    is_completed: boolean;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  incomplete_tasks: number;
  completion_rate: number;
  priority_breakdown: Array<{
    priority: string;
    count: number;
  }>;
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: 'todo' | 'in_progress' | 'completed';
  is_completed?: boolean;
}