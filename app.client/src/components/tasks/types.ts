export interface Card {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority?: "urgent" | "high" | "normal" | "low";
  status?: "new" | "scheduled" | "inprogress" | "completed";
  type?: string;
  assignee?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type?: string;
  participants?: string[];
  hasReminder?: boolean;
  hasRepeat?: boolean;
}

export interface List {
  id: string;
  title: string;
  color: string;
  card: Card[];
}
