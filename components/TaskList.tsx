import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, fieldFormData } from "@/components/types";
import { sortTasks } from "@/components/sortTasks"; // Importing utility for sorting tasks

// Typing the props for the "Tasks List" screen
type TaskListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Tasks List"
>;

const TaskList = () => {
  const [sortOption, setSortOption] = useState<"date" | "status">("date"); // Default sorting by date
  const [tasks, setTasks] = useState<fieldFormData[]>([]); // Store tasks list
  const [isLoading, setIsLoading] = useState(false); // Loading state to show spinner when fetching tasks

  const navigation = useNavigation<TaskListNavigationProp>();

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting to fetch tasks
      const keys = await AsyncStorage.getAllKeys(); // Get all keys in AsyncStorage
      const taskKeys = keys.filter((key) => key.startsWith("task_")); // Filter keys for tasks only
      const tasksArray = await Promise.all(
        taskKeys.map(async (key) => {
          const task = await AsyncStorage.getItem(key); // Fetch the task data from storage
          return task ? JSON.parse(task) : null; // Parse and return task data
        })
      );
      setTasks(tasksArray.filter(Boolean) as fieldFormData[]); // Update state with valid tasks
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks."); // Show error alert if fetching fails
    } finally {
      setIsLoading(false); // Turn off loading indicator
    }
  };

  // useEffect to reload tasks when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadTasks); // Re-fetch tasks when the screen comes into focus
    return unsubscribe; // Cleanup listener when the screen is unfocused
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({ title: "Tasks List" }); // Set screen title when component mounts
  }, [navigation]);

  // Function to change sort option (either by date or status)
  const handleSortChange = (newSortOption: "date" | "status") => {
    setSortOption(newSortOption); // Update the sorting option
  };

  // Sort tasks based on the selected sort option
  const sortedTasks = sortTasks(tasks, sortOption); // Sorting the tasks using the sortTasks utility

  // Function to navigate to task detail screen
  const openTaskDetail = (task: fieldFormData) => {
    navigation.navigate("Task Detail", { task }); // Pass selected task to detail screen
  };

  // Function to navigate to add new task screen
  const openAddTaskScreen = () => {
    navigation.navigate("Add New Task"); // Navigate to screen to add a new task
  };

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort tasks by:</Text>
        <Button title="Date" onPress={() => handleSortChange("date")} />
       
        <Button
          title="Status"
          onPress={() => handleSortChange("status")}
        />
       
      </View>
      {isLoading ? ( // If tasks are still loading, show the loading spinner
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks} // Pass the sorted tasks to FlatList
          keyExtractor={(item) => item.id} // Ensure each task has a unique key
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.date}>📅 {item.date}</Text>
                  <Text style={styles.time}>🕒 {item.time}</Text>
                </View>
              </View>

              <Text style={styles.status}>
                {item.status === "Cancelled" && "❌"}
                {item.status === "In-progress" && "🔄"}
                {item.status === "Completed" && "✅"}
                {" Status: " + item.status}
              </Text>
              <Text style={styles.location}>📍 Location: {item.location}</Text>

              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => openTaskDetail(item)} // Open the task detail screen
              >
                <Text style={styles.detailButtonText}>Detail</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />} // Add space between items
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={openAddTaskScreen}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskItem: {
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    position: "relative",
  },
  taskContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeContainer: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 14,
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    marginTop: 5,
  },
  separator: {
    height: 10,
  },
  detailButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 10,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TaskList;
