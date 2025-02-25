import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import FlatPickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import CheckBox from '@react-native-community/checkbox';
import { SettingsContext } from '../../settings-context';

type Dropdowns = {
    cognitive: boolean;
    emotional: boolean;
    physical: boolean;
    dermatological: boolean;
    other: boolean;
};

const SymptomChart = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [dropdowns, setDropdowns] = useState<Dropdowns>({
        cognitive: false,
        emotional: false,
        physical: false,
        dermatological: false,
        other: false
    });


    const handleSymptomChange = (event: boolean, symptom: string) => {
        setSelectedSymptoms(prevSelected => 
            event ? [...prevSelected, symptom] : prevSelected.filter(item => item !== symptom)
        );
    };

    const toggleDropdown = (category: keyof Dropdowns) => {
        setDropdowns(prevDropdowns => ({
            ...prevDropdowns,
            [category]: !prevDropdowns[category]
        }));
    };

    const categories = {
        cognitive: ['Brain Fog', 'Poor Concentration', 'Memory Loss'],
        emotional: ['Anxiety', 'Stress', 'Mood Swings', 'Depression', 'Panic Attacks', 'Irritability'],
        physical: ['Hot Flushes', 'Headaches', 'Fatigue', 'Muscle Pain', 'Night Sweats', 'Weight Gain', 'Dizzy Spells', 'Sore Breasts', 'Bloating', 'Digestive Problems', 'Formication', 'Itching Legs', 'Bone Fractures'],
        dermatological: ['Hair Loss', 'Dry Skin', 'Dry Mouth', 'Gum Disease', 'Body Odor', 'Brittle Nails'],
        other: ['Sleeplessness', 'Tinnitus', 'UTIs']
    };

    return (
        <View style={styles.container}>
            <FlatPickr
                options={{ mode: "range", dateFormat: "J M Y", position: "auto center" }}
                onChange={date => {}}
                style={styles.datePicker}
            />
            <Button title="Select Symptoms" onPress={() => setIsPopupVisible(true)} />
            
            {isPopupVisible && (
                <View style={styles.popup}>
                    <Text style={styles.popupTitle}>Select Symptoms</Text>
                    <ScrollView>
                        {Object.keys(categories).map((category) => {
                            const categoryKey = category as keyof typeof categories;
                            return (
                                <View key={category} style={styles.category}>
                                    <Button title={category.charAt(0).toUpperCase() + category.slice(1)} onPress={() => toggleDropdown(categoryKey)} />
                                    {dropdowns[categoryKey] && (
                                        <View style={styles.symptomList}>
                                            {categories[categoryKey].map((symptom, index) => (
                                                <View key={index} style={styles.checkboxContainer}>
                                                    <CheckBox
                                                        value={selectedSymptoms.includes(symptom)}
                                                        onValueChange={(newValue) => handleSymptomChange(newValue, symptom)}
                                                    />
                                                    <Text>{symptom}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                    <Button title="Close" onPress={() => setIsPopupVisible(false)} />
                </View>
            )}

            {/* Add your chart rendering logic here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16
    },
    datePicker: {
        marginBottom: 20,
        width: '80%'
    },
    popup: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        right: '10%',
        bottom: '20%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        zIndex: 1000
    },
    popupTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    category: {
        marginBottom: 10
    },
    symptomList: {
        marginLeft: 10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    }
});

export default SymptomChart;
