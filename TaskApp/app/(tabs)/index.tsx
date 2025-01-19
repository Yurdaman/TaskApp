import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaskList from "@/components/TaskList";
import TaskDetailScreen from "@/components/TaskDetailScreen";
import EditTask from "@/components/EditTask";
import AddNewTask from "@/components/AddNewTask";
import { RootStackParamList } from "@/components/types";

const Stack = createStackNavigator<RootStackParamList>(); // Create the stack navigator using the RootStackParamList for type safety

// The main App component, which contains the navigation stack
const App = () => {
  return (
    <Stack.Navigator initialRouteName="Tasks List">
      <Stack.Screen name="Tasks List" component={TaskList} />
      <Stack.Screen name="Task Detail" component={TaskDetailScreen} />
      <Stack.Screen name="Edit Task" component={EditTask} />
      <Stack.Screen name="Add New Task" component={AddNewTask} />
    </Stack.Navigator>
  );
};

export default App;
