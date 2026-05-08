export type TaskStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
export type Priority = "low" | "medium" | "high";

export interface TaskAssignee {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  requirements?: string;
  status: TaskStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  assignees: TaskAssignee[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  requirements?: string;
  startDate: string;
  endDate: string;
  assigneeIds: string[];
}