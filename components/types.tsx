// Root stack parameter list for navigation types
export type RootStackParamList = {
  // 'Tasks List' screen does not expect any parameters
  "Tasks List": undefined;

  // 'Task Detail' screen expects a parameter 'task' of type fieldFormData
  "Task Detail": { task: fieldFormData };

  // 'Edit Task' screen expects a parameter 'task' of type fieldFormData to edit
  "Edit Task": { task: fieldFormData };

  // 'Add New Task' screen does not expect any parameters
  "Add New Task": undefined;
};

// Interface defining the structure of a task
export interface fieldFormData {
  id: string;  // Unique identifier for the task
  title: string;  // Title of the task
  description: string;  // Detailed description of the task
  date: string;  // Date of the task (usually formatted as a string, e.g., 'YYYY-MM-DD')
  time: string;  // Time of the task (usually formatted as a string, e.g., 'HH:MM')
  location: string;  // Location where the task will take place
  // Status of the task can be one of the following: empty, 'In-progress', 'Completed', or 'Cancelled'
  status: "" | "In-progress" | "Completed" | "Cancelled";  
};
