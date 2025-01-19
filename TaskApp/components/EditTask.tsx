import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, fieldFormData } from "@/components/types";

// Typing the props for the "Edit Task" screen
type EditTaskProps = StackScreenProps<RootStackParamList, "Edit Task">;

const EditTask: React.FC<EditTaskProps> = ({ route, navigation }) => {
  const { task } = route.params;  // Get the task data passed from the previous screen

  // Initialize form data with the task data
  const [formData, setFormData] = useState<fieldFormData>({
    id: task.id,
    title: task.title,
    description: task.description,
    date: task.date,
    time: task.time,
    location: task.location,
    status: task.status,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  // Function to update form data when user modifies input
  const handleChange = <K extends keyof fieldFormData>(
    key: K,
    value: fieldFormData[K]
  ) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  // Handle the date or time picker change and format the selected value
  const handlePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString();
      const formattedTime = selectedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (pickerMode === "date") {
        handleChange("date", formattedDate);
      } else {
        handleChange("time", formattedTime);
      }
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  // Handle form submission, validate the form, and update AsyncStorage
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
      // Update the task in AsyncStorage
      await AsyncStorage.setItem(
        `task_${formData.id}`,
        JSON.stringify(formData)
      );
      Alert.alert(
        "Success",
        `Task "${formData.title}" updated.`,
        [
          {
            text: "OK",
            onPress: () => {
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
      Alert.alert("Error", "Failed to save task.");  // Alert if there is an error saving the task
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
        />

      
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        {/* Date and Time inputs */}
        <Text style={styles.label}>Date and Time</Text>
        <View style={styles.dateTimeContainer}>
          {/* Date input */}
          <TextInput
            style={[styles.input, styles.dateInput]}
            value={formData.date}
            onFocus={() => {
              setPickerMode("date");
              setShowDatePicker(true); // Show date picker when focused
            }}
          />
          {/* Time input */}
          <TextInput
            style={[styles.input, styles.timeInput]}
            value={formData.time}
            onFocus={() => {
              setPickerMode("time");
              setShowTimePicker(true); // Show time picker when focused
            }}
          />
        </View>

        {/* Show the date/time picker if needed */}
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
        />

       
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} />
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
    padding: 10,
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
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 60,
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
    marginBottom: 15,
  },
  dateInput: {
    width: "65%",
    marginRight: "4%",
  },
  timeInput: {
    width: "30%",
  },
});

export default EditTask;
