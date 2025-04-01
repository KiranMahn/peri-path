import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { SettingsContext } from '../settings-context';
import symptomsData from '../../symptoms.json'; 

const Settings = () => {
    const { settings, saveSettings } = useContext(SettingsContext);

    // Format the symptom name eg. from "brainfog" to "Brain Fog"
    const getFormattedValue = (sliderValue) => {
        const symptom = symptomsData.symptoms.find((item) => item.key === sliderValue);
        return symptom ? symptom.symptom : sliderValue; 
    };

    // Export user data to CSV
    const exportDataToCSV = async () => {

        try {

            // get users data
            const allUsersData = await AsyncStorage.getItem("allUsersData");

            // handle no data case
            if (!allUsersData) {
                Alert.alert("No data to export.");
                return;
            }
    
            const data = JSON.parse(allUsersData);
            const csvRows = ["Date,Key,Value"]; 
            const dataRows = []; 
    
            // Convert data to CSV rows
            Object.keys(data).forEach((user) => {

                // for each date
                Object.keys(data[user]).forEach((date) => {

                    // get day data
                    const dayData = data[user][date];

                    // for each symptom log date, symptom, and value
                    Object.keys(dayData).forEach((key) => {
                        if (dayData[key] !== "None" && key !== "period") { 

                            const formattedValue = getFormattedValue(key); 
                            console.log(formattedValue);
                            dataRows.push({ date, key: formattedValue, value: dayData[key] });

                        }
                    });

                });
            });
    
            // Sort rows by date
            dataRows.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            // Add sorted rows to the CSV
            dataRows.forEach((row) => {
                csvRows.push(`${row.date},${row.key},${row.value}`);
            });
    
            // join rows together
            const csvString = csvRows.join("\n");
            const fileUri = FileSystem.documentDirectory + "exported_data.csv";
    
            // write CSV to file
            await FileSystem.writeAsStringAsync(fileUri, csvString);
    
            // share the file w/user 
            await Sharing.shareAsync(fileUri);

        } catch (error) {
            Alert.alert("Error exporting data", error.message);
        }
    };

    // Reset user data 
    const resetData = async () => {

        Alert.alert(
            "Reset Data",
            "Are you sure you want to reset all your data? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {

                        try {
                            await AsyncStorage.clear();
                            Alert.alert("Data reset successfully.");
                        } catch (error) {
                            Alert.alert("Error resetting data", error.message);
                        }

                    },
                },
            ]
        );

    };

    // toggle high contrast mode
    const toggleHighContrast = () => {
        saveSettings({ ...settings, highContrast: !settings.highContrast });
    };

    // toggle large text mode
    const toggleLargeText = () => {
        saveSettings({ ...settings, largeText: !settings.largeText });
    };

    return (
        <View style={[styles.container, settings.highContrast && styles.highContrast]}>

            {/* Export Data Btn */}
            <TouchableOpacity style={styles.button} onPress={exportDataToCSV}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>Export Data to CSV</Text>
            </TouchableOpacity>

            {/* Toggle Large Text Btn */}
            <TouchableOpacity style={styles.button} onPress={toggleLargeText}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>
                    {settings.largeText ? "Disable Large Text" : "Enable Large Text"}
                </Text>
            </TouchableOpacity>

            {/* Toggle High Contrast Btn */}
            <TouchableOpacity style={styles.button} onPress={toggleHighContrast}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>
                    {settings.highContrast ? "Disable High Contrast" : "Enable High Contrast"}
                </Text>
            </TouchableOpacity>

            {/* Reset Data Btn */}
            <TouchableOpacity style={styles.button} onPress={resetData}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>Reset Data</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    highContrast: {
        backgroundColor: "#000000",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#009688",
    },
    largeText: {
        fontSize: 24, 
    },
    button: {
        backgroundColor: "#009688",
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonText: {
        color: "#ffffff",
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default Settings;