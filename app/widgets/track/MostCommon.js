import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SettingsContext } from '../../settings-context'; // Import SettingsContext
const MostCommon = ({ onTrack, sliderValues }) => {
    const [selectedButtons, setSelectedButtons] = useState([]);
    const { settings } = useContext(SettingsContext); // Access settings from context
    const commonSymptoms = [
        { symptom: 'Anxiety', level: 'Medium' },
        { symptom: 'Brain Fog', level: 'High' },
        { symptom: 'Hot Flushes', level: 'Low' },
        { symptom: 'Headaches', level: 'Medium' },
        { symptom: 'Fatigue', level: 'High' },
        { symptom: 'Mood Swings', level: 'Low' }
    ];

    useEffect(() => {
        const initialSelectedButtons = commonSymptoms.reduce((acc, item, index) => {
            const sliderValue = sliderValues[item.symptom.toLowerCase().replace(' ', '')];
            const levels = ['None', 'Low', 'Medium', 'High'];
            if (sliderValue !== undefined && levels[sliderValue] === item.level) {
                acc.push(index);
            }
            return acc;
        }, []);
        setSelectedButtons(initialSelectedButtons);
    }, [sliderValues]);

    const handleButtonClick = (symptom, level, index) => {
        setSelectedButtons(prevSelected => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter(i => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
        onTrack(symptom, level);
    };

    return (
        <View style={styles.container}>
            {commonSymptoms.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleButtonClick(item.symptom, item.level, index)}
                    style={[
                        styles.button,
                        selectedButtons.includes(index) ? styles.selectedButton : settings.highContrast ? styles.highContrastButton : styles.unselectedButton
                    ]}
                >
                    <Text style={[styles.buttonText, selectedButtons.includes(index) ? styles.selectedText : settings.highContrast ? styles.highContrastText : styles.unselectedText, { fontSize: settings.largeText ? 17 : 15 }]}>
                        {item.level} {item.symptom}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        width: '23%',
        height: 100,
    },
    selectedButton: {
        backgroundColor: '#009688',
    },
    highContrastButton: {
        backgroundColor: '#555',
    },
    highContrastText: {
        color: 'white'
    },
    unselectedButton: {
        backgroundColor: '#f0f0f0',
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    selectedText: {
        color: '#ffffff',
    },
    unselectedText: {
        color: '#009688',
    }
});

export default MostCommon;
