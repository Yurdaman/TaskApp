import React, { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, Alert, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, fieldFormData } from "@/components/types";
import { SafeAreaView } from "react-native-safe-area-context";

// Typing the props for the "Add New Task" screen
type AddNewTaskProps = StackScreenProps<RootStackParamList, "Add New Task">;

const AddNewTask: React.FC<AddNewTaskProps> = ({ navigation }) => {
  // Initialize state for the form data
  const [formData, setFormData] = useState<fieldFormData>({
    id: Date.now().toString(), // Use the current time as a unique ID for the task
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "", // Default status is empty
  });

  // States to control the visibility of the date and time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  // Function to update the form data when the user modifies an input
  const handleChange = <K extends keyof fieldFormData>(
    key: K,
    value: fieldFormData[K]
  ) => {
    setFormData({
      ...formData,
      [key]: value, // Update the corresponding field
      status: "In-progress", // Set the task status to "In-progress" by default
    });
  };

  // Function to handle date/time picker change and format the selected value
  const handlePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const formattedTime = selectedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (pickerMode === "date") {
        handleChange("date", formattedDate); // Save the formatted date (YYYY-MM-DD)
      } else {
        handleChange("time", formattedTime); // Save the formatted time
      }
    }
    setShowDatePicker(false);
    setShowTimePicker(false); // Close the picker after selection
  };

  // Function to handle form submission, validate and save the task to AsyncStorage
  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location
    ) {
      Alert.alert("Error", "All fields must be filled out!"); // Show alert if any field is missing
      return;
    }

    try {
      // Save the task as an individual object in AsyncStorage
      await AsyncStorage.setItem(
        `task_${formData.id}`,
        JSON.stringify(formData)
      );
      Alert.alert(
        "Success",
        `Task "${formData.title}" added.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset the form and navigate back to the tasks list
              setFormData({
                id: Date.now().toString(),
                title: "",
                description: "",
                date: "",
                time: "",
                location: "",
                status: "",
              });
              navigation.reset({
                index: 0,
                routes: [{ name: "Tasks List" }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save task."); // Show alert if there's an error saving the task
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.formGroup}>
       
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => handleChange("title", text)}
          placeholder="Enter title"
        />

       
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Enter description"
        />

       
        <Text style={styles.label}>Date and Time</Text>
        <View style={styles.dateTimeContainer}>
        
          <TextInput
            style={[styles.input, styles.dateInput]}
            value={formData.date}
            placeholder="Enter date"
            onFocus={() => {
              setPickerMode("date");
              setShowDatePicker(true); // Show date picker when focused
            }}
          />
          
          <TextInput
            style={[styles.input, styles.timeInput]}
            value={formData.time}
            placeholder="Enter time"
            onFocus={() => {
              setPickerMode("time");
              setShowTimePicker(true); // Show time picker when focused
            }}
          />
        </View>

        {/* Show date/time picker if necessary */}
        {(showDatePicker || showTimePicker) && (
          <DateTimePicker
            value={new Date()} // Set initial value as current date/time
            mode={pickerMode}
            display="default"
            onChange={handlePickerChange}
          />
        )}

       
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => handleChange("location", text)}
          placeholder="Enter location"
        />

        
        <View style={styles.buttonContainer}>
          <Button title={"Submit"} onPress={handleSubmit} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 10,
    borderColor: "#e5e5e9",
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  formGroup: {
    width: "100%",
    maxWidth: 300,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 7,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  buttonContainer: {
    alignSelf: "center",
    width: "60%",
    marginTop: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateInput: {
    width: "65%",
    marginRight: "4%",
  },
  timeInput: {
    width: "30%",
  },
});

export default AddNewTask;
