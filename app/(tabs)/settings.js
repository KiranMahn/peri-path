import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { SettingsContext } from '../settings-context';

const Settings = () => {
    const { settings, saveSettings } = useContext(SettingsContext);

    // Export AsyncStorage data to CSV
    const exportDataToCSV = async () => {
        try {
            const allUsersData = await AsyncStorage.getItem("allUsersData");
            if (!allUsersData) {
                Alert.alert("No data to export.");
                return;
            }
    
            const data = JSON.parse(allUsersData);
            console.log(data);
            const csvRows = ["Date,User,Key,Value"]; // CSV header
    
            // Convert data to CSV rows
            Object.keys(data).forEach((user) => {
                Object.keys(data[user]).forEach((date) => {
                    const dayData = data[user][date];
                    Object.keys(dayData).forEach((key) => {
                        if (dayData[key] !== "None") { // Only include data where the value is not "None"
                            console.log("daydata[key] ", dayData[key]);
                            csvRows.push(`${date},${user},${key},${dayData[key]}`);
                        }
                    });
                });
            });
    
            const csvString = csvRows.join("\n");
            const fileUri = FileSystem.documentDirectory + "exported_data.csv";
    
            // Write CSV to file
            await FileSystem.writeAsStringAsync(fileUri, csvString);
    
            // Share the file
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            Alert.alert("Error exporting data", error.message);
        }
    };

    // Reset AsyncStorage data with confirmation
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

    // Toggle high contrast mode
    const toggleHighContrast = () => {
        saveSettings({ ...settings, highContrast: !settings.highContrast });
    };

    // Toggle large text mode
    const toggleLargeText = () => {
        saveSettings({ ...settings, largeText: !settings.largeText });
    };

    return (
        <View style={[styles.container, settings.highContrast && styles.highContrast]}>
            {/* Export Data */}
            <TouchableOpacity style={styles.button} onPress={exportDataToCSV}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>Export Data to CSV</Text>
            </TouchableOpacity>

            {/* Toggle Large Text */}
            <TouchableOpacity style={styles.button} onPress={toggleLargeText}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>
                    {settings.largeText ? "Disable Large Text" : "Enable Large Text"}
                </Text>
            </TouchableOpacity>

            {/* Toggle High Contrast */}
            <TouchableOpacity style={styles.button} onPress={toggleHighContrast}>
                <Text style={[styles.buttonText, settings.largeText && styles.largeText]}>
                    {settings.highContrast ? "Disable High Contrast" : "Enable High Contrast"}
                </Text>
            </TouchableOpacity>

            {/* Reset Data */}
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
        fontSize: 24, // Increase font size for large text
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