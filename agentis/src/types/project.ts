export type ProjectStatus = 'draft' | 'generated' | 'ready';

export interface Project {
  id: string;
  name: string;
  customer_context: string;
  objectives: string;
  viz_thoughts: string;
  created_at: string;   // ISO 8601
  updated_at: string;   // ISO 8601
  status: ProjectStatus;
}

export interface ProjectCreate {
  name: string;
  customer_context: string;
  objectives: string;
  viz_thoughts: string;
}

export interface ProjectUpdate {
  name?: string;
  customer_context?: string;
  objectives?: string;
  viz_thoughts?: string;
}
