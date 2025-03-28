import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import symptoms from '../../symptoms.json'; // Import symptoms data
import MostCommon from '../widgets/track/MostCommon'; // Component for quick add of common symptoms
import PeriodSquare from '../widgets/track/PeriodSquare'; // Component for tracking period severity
import Slider from '../widgets/track/Slider'; // Component for tracking symptoms with sliders
import { useNavigation } from '@react-navigation/native'; // Navigation hook
import { Ionicons } from '@expo/vector-icons'; // Icons for dropdowns
import AsyncStorage from '@react-native-async-storage/async-storage'; // For data persistence
import TwoWeek from '../widgets/calendar/two-week';
import Calendar from './calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SettingsContext } from '../settings-context'; // Import SettingsContext

const Track = () => {
    const navigation = useNavigation(); // Navigation instance
    const { settings } = useContext(SettingsContext); // Access settings from context
    const [currentDate, setCurrentDate] = useState(''); // Current date in string format
    const [sliderValues, setSliderValues] = useState({}); // State for slider values
    const [selectedPeriod, setSelectedPeriod] = useState(''); // State for selected period severity
    const [dropdowns, setDropdowns] = useState({ // State for dropdown visibility
        mental: false,
        physical: false,
        other: false
    });
    const [isCalendarVisible, setIsCalendarVisible] = useState(false); // State for calendar visibility
    const [date, setDate] = useState(new Date()); // State for selected date

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            const formattedDate = selectedDate.toDateString(); // Format the date to match AsyncStorage format
            console.log("Selected date: ", formattedDate);
    
            setDate(selectedDate); // Update the selected date state
            setCurrentDate(formattedDate); // Update the current date display
            setIsCalendarVisible(false); // Hide the calendar dropdown
    
            // Load the data for the selected date
            loadUserData(formattedDate);
        }
    };
    
    // Load user data and initialize state on component mount or when the date changes
    const loadUserData = async (dateString) => {
        const user = JSON.parse(await AsyncStorage.getItem('user')); // Get current user
        const username = user ? user.username : 'Unknown User'; // Default to 'Unknown User' if no user
        const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {}; // Get all users' data
        const userData = allUsersData[username] || {}; // Get current user's data
        const savedData = userData[dateString] || {}; // Get saved data for the specified date
    
        // Initialize slider values with default values (0)
        const initialSliderValues = symptoms.symptoms.reduce((acc, symptom) => {
            acc[symptom.key] = 0;
            return acc;
        }, {});
    
        // Update slider values with saved data
        const updatedSliderValues = { ...initialSliderValues };
        symptoms.symptoms.forEach(symptom => {
            updatedSliderValues[symptom.key] = ['None', 'Low', 'Medium', 'High'].indexOf(savedData[symptom.key]) !== -1
                ? ['None', 'Low', 'Medium', 'High'].indexOf(savedData[symptom.key])
                : 0;
        });
    
        setSliderValues(updatedSliderValues); // Set slider values
        setSelectedPeriod(savedData.period || ''); // Set selected period severity
    };
    
    // Call `loadUserData` on component mount with the current date
    useEffect(() => {
        const dateString = date.toDateString(); // Format current date as a string
        setCurrentDate(dateString);
        loadUserData(dateString); // Load data for the current date
    }, []);
    
    // Handle slider value changes
    const handleSliderChange = (name, value) => {
        setSliderValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    // Handle period tracking
    const handleTrackPeriod = (level) => {
        if (selectedPeriod === level) {
            // If the same period square is pressed, unselect it
            setSelectedPeriod(''); // Clear the selected period
        } else {
            // Otherwise, select the new period level
            setSelectedPeriod(level);
        }
    };

    // Save the tracked data to AsyncStorage
    const handleSave = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user')); // Get current user
        const username = user ? user.username : 'Unknown User'; // Default to 'Unknown User' if no user
        const sliderStatuses = symptoms.symptoms.reduce((acc, symptom) => {
            console.log("symptom from sliderStatuses: ", symptom);
            acc[symptom.key] = ['None', 'Low', 'Medium', 'High'][sliderValues[symptom.key]];
            console.log("acc: ", acc);
            console.log("acc[symptom.key]: ", acc[symptom.key]);
            return acc;
        }, {});

        const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {}; // Get all users' data
        if (!allUsersData[username]) {
            allUsersData[username] = {}; // Initialize user data if not present
        }
        allUsersData[username][currentDate] = {
            ...sliderStatuses,
            period: selectedPeriod
        };
        await AsyncStorage.setItem('allUsersData', JSON.stringify(allUsersData)); // Save updated data

        navigation.navigate('Home'); // Navigate to the Calendar screen
    };

    // Handle quick add of common symptoms
    const handleTrackCommon = (symptom, level) => {
        const levels = ['None', 'Low', 'Medium', 'High'];
        const symptomKey = symptom.toLowerCase().replace(' ', '');

        setSliderValues(prevValues => {
            // If the symptom is already set to the same level, unselect it (set to "None")
            if (levels[prevValues[symptomKey]] === level) {
                return {
                    ...prevValues,
                    [symptomKey]: 0, // Set to "None"
                };
            }

            // Otherwise, set the symptom to the new level
            return {
                ...prevValues,
                [symptomKey]: levels.indexOf(level),
            };
        });
    };

    // Toggle dropdown visibility for symptom categories
    const toggleDropdown = (category) => {
        setDropdowns(prevDropdowns => ({
            ...prevDropdowns,
            [category]: !prevDropdowns[category]
        }));
    };

    // Symptom categories and their respective symptoms
    const categories = {
        cognitive: ['Brain Fog', 'Poor Concentration', 'Memory Loss'],
        emotional: ['Anxiety', 'Mood Swings', 'Depression', 'Panic Attacks', 'Irritability'],
        physical: ['Hot Flushes', 'Headaches', 'Fatigue', 'Muscle Pain', 'Night Sweats', 'Weight Gain', 'Dizzy Spells', 'Sore Breasts', 'Bloating', 'Digestive Problems', 'Formication', 'Itching Legs', 'Bone Fractures'],
        dermatological: ['Hair Loss', 'Dry Skin', 'Dry Mouth', 'Gum Disease', 'Body Odor', 'Brittle Nails'],
        other: ['Sleeplessness', 'Tinnitus', 'UTIs']
    };
    const toggleDayDropdown = () => {
        setIsCalendarVisible(!isCalendarVisible);
    };


    

    return (
        <View style={[styles.container, {backgroundColor: settings.highContrast ? '#000' : '#fff'}]}>
            {/* Dropdown for selecting another day */}

            <TouchableOpacity onPress={toggleDayDropdown} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 10, alignItems: 'center' }}>
                <Text style={[styles.dateText, { fontSize: settings.largeText ? 23 : 18, color: settings.highContrast ? 'white' : 'black' }]}>{currentDate}</Text>
                <Ionicons name={isCalendarVisible ? 'chevron-up' : 'chevron-down'} size={settings.largeText ? 23 : 18} color="#009688" />
            </TouchableOpacity>
            {isCalendarVisible && (
                <DateTimePicker
                    mode='date'
                    value={date}
                    onChange={onChange}
                    style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10, backgroundColor: '#009688', alignSelf: 'center', TextAlign: 'center' }}
                />            
            )}

            

            <ScrollView>
            <Text style={[styles.sectionTitle, {color: settings.highContrast ? 'white' : 'black'}]}>Period</Text>
            <View style={styles.periodContainer}>
                <PeriodSquare level="Light" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Light'} />
                <PeriodSquare level="Medium" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Medium'} />
                <PeriodSquare level="Heavy" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Heavy'} />
                <PeriodSquare level="Spotting" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Spotting'} />
            </View>

            {/* Quick add section */}
            <Text style={[styles.sectionTitle, {color: settings.highContrast ? 'white' : 'black'}]}>Quick Add</Text>
            <MostCommon onTrack={handleTrackCommon} sliderValues={sliderValues} />

            {/* Symptoms tracking section */}
            <Text style={[styles.sectionTitle, {color: settings.highContrast ? 'white' : 'black'}]}>Symptoms</Text>
            <ScrollView style={styles.scrollView}>
                {Object.keys(categories).map(category => (
                    <View key={category} style={styles.categoryContainer}>
                        {/* Dropdown for symptom category */}
                        <TouchableOpacity onPress={() => toggleDropdown(category)} style={[styles.categoryButton, {backgroundColor: settings.highContrast ? '#555' : '#f0f0f0'}]}>
                            <Text style={[styles.categoryButtonText, {fontSize: settings.largeText ? 20 : 15, fontWeight: settings.largeText ? 'bold' : 'normal', color: settings.highContrast ? 'white' : 'black'}]}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                            <Ionicons name={dropdowns[category] ? 'chevron-up' : 'chevron-down'} size={20} color={settings.highContrast ? 'white' : "#009688"} />
                        </TouchableOpacity>
                        {/* List of symptoms in the category */}
                        {dropdowns[category] && (
                            <View style={[styles.symptomList, {backgroundColor: settings.highContrast ? '#000' : '#f9f9f9'}]}>
                                {categories[category].map((symptom, index) => {
                                    const symptomKey = symptom.toLowerCase().replace(' ', '');
                                    return (
                                        <Slider
                                            key={index}
                                            sliderText={symptom}
                                            onChange={(value) => handleSliderChange(symptomKey, value)}
                                            value={sliderValues[symptomKey]}
                                        />
                                    );
                                })}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            </ScrollView>
            {/* Period tracking section */}
            

            {/* Save button */}
            <View style={[styles.footer, {backgroundColor: settings.highContrast ? '#009688' : '#f8f8f8', borderTopColor: settings.highContrast ? '#000' : '#ddd'}]}>
                <Button title="Save" onPress={handleSave} color={settings.highContrast ? 'white' : '#009688'}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    dateText: {
        fontWeight: 'bold',
        marginBottom: 8,
        alignSelf: 'center',
        marginRight: 5
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    periodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    scrollView: {
        marginTop: 16,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    categoryButtonText: {
        color: '#009688',
        fontSize: 16,
    },
    symptomList: {
        paddingLeft: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginTop: 8,
    },
    footer: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginBottom: 15,
    },
});

export default Track;