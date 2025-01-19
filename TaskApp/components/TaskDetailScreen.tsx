import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, fieldFormData } from "@/components/types";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Typing the props for the "Task Detail" screen
type TaskDetailScreenProps = StackScreenProps<
  RootStackParamList,
  "Task Detail"
>;

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { task } = route.params; // Destructuring the task object from route parameters
  const [status, setStatus] = useState<
    "In-progress" | "Completed" | "Cancelled"
  >(
    task?.status || "In-progress" // Initialize status with the task's status or default to 'In-progress'
  );

  // Function to update the task in AsyncStorage
  const updateTaskInStorage = async (updatedTask: fieldFormData) => {
    try {
      await AsyncStorage.setItem(
        `task_${updatedTask.id}`, // Key is based on the task's ID
        JSON.stringify(updatedTask) // Save the updated task as a string
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update task."); // Alert on failure
    }
  };

  // Function to handle status change (e.g., 'In-progress', 'Completed', 'Cancelled')
  const handleStatusChange = (
    newStatus: "In-progress" | "Completed" | "Cancelled"
  ) => {
    setStatus(newStatus); // Update status in the state
    const updatedTask = { ...task, status: newStatus }; // Create updated task with new status
    updateTaskInStorage(updatedTask); // Save updated task to AsyncStorage
  };

  // Navigate to Edit Task screen with the updated task
  const handleEdit = () => {
    const updatedTask = { ...task, status }; // Create a task with updated status
    navigation.navigate("Edit Task", { task: updatedTask }); // Pass the updated task to the Edit Task screen
  };

  // Handle task deletion with a confirmation alert
  const handleRemove = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`task_${task.id}`); // Remove task from AsyncStorage
              console.log("Task removed", task.id);
              Alert.alert(
                "Task Deleted",
                `The task "${task.title}" has been successfully removed.`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.goBack(); // Navigate back after deletion
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to delete task."); // Alert on failure
            }
          },
        },
      ]
    );
  };

  // Effect hook to update task status in AsyncStorage when status changes
  useEffect(() => {
    if (status !== task.status) {
      const updatedTask = { ...task, status }; // Update task with new status
      updateTaskInStorage(updatedTask); // Save updated task to AsyncStorage
    }
  }, [status]); // Dependency on status change

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <View style={styles.infoBox}>
        <Text style={styles.text}>{task.title}</Text>
      </View>

      <Text style={styles.label}>Description:</Text>
      <View style={styles.infoBox}>
        <Text style={styles.textDescription}>{task.description}</Text>
      </View>

      <Text style={styles.label}>Date and Time:</Text>
      <View style={styles.infoBox}>
        <Text style={styles.text}>
          {task.date} | {task.time}
        </Text>
      </View>

      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status} // Display the current status
        onValueChange={handleStatusChange} // Handle status change when picker value changes
        style={styles.picker}
      >
        <Picker.Item label="In-Progress" value="In-progress" />
        <Picker.Item label="Completed" value="Completed" />
        <Picker.Item label="Cancelled" value="Cancelled" />
      </Picker>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={handleEdit} // Trigger edit task navigation
        >
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.removeButton]}
          onPress={handleRemove} // Trigger task deletion
        >
          <Text style={styles.buttonText}>Remove Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    fontWeight: "600",
  },
  infoBox: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  textDescription: {
    fontSize: 16,
    color: "#333",
    height: 60,
  },
  picker: {
    height: 60,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 30,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "green",
  },
  removeButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TaskDetailScreen;
