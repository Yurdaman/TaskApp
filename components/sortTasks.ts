// utils/sortTasks.ts
import { fieldFormData } from "@/components/types";

// Function to sort tasks based on the selected sorting option
export const sortTasks = (
  tasks: fieldFormData[],  // Array of tasks to be sorted
  sortOption: "date" | "status"  // The sorting option: either by 'date' or 'status'
): fieldFormData[] => {
  const sortedTasks = [...tasks];  // Create a shallow copy of tasks to avoid mutating the original array

  // Sort tasks based on the selected option
  if (sortOption === "date") {
    // If sorting by date, compare the date values (assuming date is a string)
    sortedTasks.sort((a, b) => a.date.localeCompare(b.date));  // Sorting alphabetically by date
  } else {
    // If sorting by status, compare the status values (assuming status is a string)
    sortedTasks.sort((a, b) => a.status.localeCompare(b.status));  // Sorting alphabetically by status
  }

  return sortedTasks;  // Return the sorted array
};
