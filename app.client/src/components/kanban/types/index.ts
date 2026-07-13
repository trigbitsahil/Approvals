export type Subtask = {
  id?: string;
  name: string;
  status?: string;
  description?: string;
};

export type Card = {
  id: string;
  title: string;
  priority?: string;
  taskPriorityId?: string | null;
  dueDate?: string;
  status?: string;
  type?: string;
  assignee?: string;
  description?: string;
  estimatedTime?: string;
  taskTypeId?: string | null;
  subtasks?: Subtask[];
  estimatedHours?: number;
  assignedTo?: string;
  startDate?: string;
};

export type List = {
  id: string;
  title: string;
  color: string;
  card: Card[];
};
export type Lists = {
  [key: string]: List;
};
