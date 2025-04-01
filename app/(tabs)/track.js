import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import symptoms from '../../symptoms.json'; 
import MostCommon from '../widgets/track/MostCommon'; 
import PeriodSquare from '../widgets/track/PeriodSquare'; 
import Slider from '../widgets/track/Slider'; 
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SettingsContext } from '../settings-context';

// Track Screen 
const Track = ({ route }) => {
    const navigation = useNavigation();
    const { settings } = useContext(SettingsContext);
    const { date: initialDateProp } = route.params || {}; 
    const [currentDate, setCurrentDate] = useState('');
    const [date, setDate] = useState(initialDateProp ? new Date(initialDateProp) : new Date());
    const [sliderValues, setSliderValues] = useState({}); 
    const [selectedPeriod, setSelectedPeriod] = useState(''); 
    const [dropdowns, setDropdowns] = useState({ 
        mental: false,
        physical: false,
        other: false
    });    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    // handles the user pressing the date picker
    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            const formattedDate = selectedDate.toDateString();
            setDate(selectedDate);
            setCurrentDate(formattedDate);
            setIsCalendarVisible(false);
            loadUserData(formattedDate);

        }
    };

    // load user data for selected date
    const loadUserData = async (dateString) => {
        const user = JSON.parse(await AsyncStorage.getItem('user')); 
        const username = user ? user.username : 'Unknown User'; 
        const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {}; 
        const userData = allUsersData[username] || {}; 
        const savedData = userData[dateString] || {}; 
    
        const initialSliderValues = symptoms.symptoms.reduce((acc, symptom) => {
            acc[symptom.key] = 0;
            return acc;
        }, {});
    
        const updatedSliderValues = { ...initialSliderValues };
        symptoms.symptoms.forEach(symptom => {
            updatedSliderValues[symptom.key] = ['None', 'Low', 'Medium', 'High'].indexOf(savedData[symptom.key]) !== -1
                ? ['None', 'Low', 'Medium', 'High'].indexOf(savedData[symptom.key])
                : 0;
        });
    
        setSliderValues(updatedSliderValues); 
        setSelectedPeriod(savedData.period || ''); 
    };
    
    useEffect(() => {
        const dateString = date.toDateString();
        setCurrentDate(dateString);
        loadUserData(dateString); 
    }, []);
    
    // handle slider changes
    const handleSliderChange = (name, value) => {
        setSliderValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    // handle period tracking
    const handleTrackPeriod = (level) => {
        if (selectedPeriod === level) {
            setSelectedPeriod(''); 
        } else {
            setSelectedPeriod(level);
        }
    };

    // save tracked data and go to home screen 
    const handleSave = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user')); 
        const username = user ? user.username : 'Unknown User'; 
        const sliderStatuses = symptoms.symptoms.reduce((acc, symptom) => {
            acc[symptom.key] = ['None', 'Low', 'Medium', 'High'][sliderValues[symptom.key]];
            return acc;
        }, {});

        const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {}; 
        if (!allUsersData[username]) {
            allUsersData[username] = {}; 
        }
        allUsersData[username][currentDate] = {
            ...sliderStatuses,
            period: selectedPeriod
        };

        await AsyncStorage.setItem('allUsersData', JSON.stringify(allUsersData)); 

        navigation.navigate('Home');
    };

    // quick add button handling 
    const handleTrackCommon = (symptom, level) => {
        const levels = ['None', 'Low', 'Medium', 'High'];
        const symptomKey = symptom.toLowerCase().replace(' ', '');

        setSliderValues(prevValues => {
            if (levels[prevValues[symptomKey]] === level) {
                return {
                    ...prevValues,
                    [symptomKey]: 0, 
                };
            }

            return {
                ...prevValues,
                [symptomKey]: levels.indexOf(level),
            };
        });
    };

    const toggleDropdown = (category) => {
        setDropdowns(prevDropdowns => ({
            ...prevDropdowns,
            [category]: !prevDropdowns[category]
        }));
    };

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
        <View style={[styles.container, { backgroundColor: settings.highContrast ? '#000' : '#fff' }]}>

            {/** Displays date */}
            <TouchableOpacity
                onPress={toggleDayDropdown}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 10, alignItems: 'center' }}
            >

                <Text
                    style={[
                        styles.dateText,
                        { fontSize: settings.largeText ? 23 : 18, color: settings.highContrast ? 'white' : 'black' },
                    ]}
                >
                    {currentDate}
                </Text>

                <Ionicons name={isCalendarVisible ? 'chevron-up' : 'chevron-down'} size={settings.largeText ? 23 : 18} color="#009688" />

            </TouchableOpacity>

            {/** date picker */}
            {isCalendarVisible && (
                <DateTimePicker
                    mode="date"
                    value={date}
                    onChange={onChange}
                    style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10, alignSelf: 'center', textAlign: 'center' }}
                />
            )}

            <ScrollView>

                {/** period tracking */}
                <Text style={[styles.sectionTitle, {color: settings.highContrast ? 'white' : 'black'}]}>Period</Text>
                <View style={styles.periodContainer}>
                    <PeriodSquare level="Light" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Light'} />
                    <PeriodSquare level="Medium" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Medium'} />
                    <PeriodSquare level="Heavy" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Heavy'} />
                    <PeriodSquare level="Spotting" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Spotting'} />
                </View>

                {/* quick add */}
                <Text style={[styles.sectionTitle, {color: settings.highContrast ? 'white' : 'black'}]}>Quick Add</Text>
                <MostCommon onTrack={handleTrackCommon} sliderValues={sliderValues} />

                {/* Symptoms tracking slider section */}
                <Text style={[styles.sectionTitle, {color: settings.highContrast ? 'white' : 'black'}]}>Symptoms</Text>
                <ScrollView style={styles.scrollView}>

                    {/* categories */}  
                    {Object.keys(categories).map(category => (
                        <View key={category} style={styles.categoryContainer}>

                            {/** category dropdown */}
                            <TouchableOpacity onPress={() => toggleDropdown(category)} style={[styles.categoryButton, {backgroundColor: settings.highContrast ? '#555' : '#f0f0f0'}]}>

                                <Text style={[styles.categoryButtonText, {fontSize: settings.largeText ? 20 : 15, fontWeight: settings.largeText ? 'bold' : 'normal', color: settings.highContrast ? 'white' : 'black'}]}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Text>
                                <Ionicons name={dropdowns[category] ? 'chevron-up' : 'chevron-down'} size={20} color={settings.highContrast ? 'white' : "#009688"} />

                            </TouchableOpacity>


                            {/* sliders */}
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

            {/* save btn */}
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