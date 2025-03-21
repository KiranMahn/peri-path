import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import symptoms from '../../symptoms.json';
import MostCommon from '../widgets/track/MostCommon';
import PeriodSquare from '../widgets/track/PeriodSquare';
import Slider from '../widgets/track/Slider';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For data persistence

const Track = () => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState('');
    const [sliderValues, setSliderValues] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [dropdowns, setDropdowns] = useState({
        mental: false,
        physical: false,
        other: false
    });

    useEffect(() => {
        const date = new Date();
        const dateString = date.toDateString();
        setCurrentDate(dateString);

        const loadUserData = async () => {
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
                updatedSliderValues[symptom.key] = ['None', 'Low', 'Medium', 'High'].indexOf(savedData[symptom.key]) !== -1 ? ['None', 'Low', 'Medium', 'High'].indexOf(savedData[symptom.key]) : 0;
            });

            setSliderValues(updatedSliderValues);
            setSelectedPeriod(savedData.period || '');
        };

        loadUserData();
    }, []);

    const handleSliderChange = (name, value) => {
        setSliderValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleTrackPeriod = (level) => {
        setSelectedPeriod(level);
    };

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
        const currentDate = new Date().toDateString();
        allUsersData[username][currentDate] = {
            ...sliderStatuses,
            period: selectedPeriod
        };
        await AsyncStorage.setItem('allUsersData', JSON.stringify(allUsersData));

        navigation.navigate('Calendar'); // Assuming you're using React Navigation
    };

    const handleTrackCommon = (symptom, level) => {
        const levels = ['None', 'Low', 'Medium', 'High'];
        setSliderValues(prevValues => ({
            ...prevValues,
            [symptom.toLowerCase().replace(' ', '')]: levels.indexOf(level)
        }));
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.button}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.button}>Profile</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.dateText}>{currentDate}</Text>

            <Text style={styles.sectionTitle}>Period</Text>
            <View style={styles.periodContainer}>
                <PeriodSquare level="Light" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Light'} />
                <PeriodSquare level="Medium" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Medium'} />
                <PeriodSquare level="Heavy" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Heavy'} />
                <PeriodSquare level="Spotting" onTrack={handleTrackPeriod} selected={selectedPeriod === 'Spotting'} />
            </View>

            <Text style={styles.sectionTitle}>Quick Add</Text>
            <MostCommon onTrack={handleTrackCommon} sliderValues={sliderValues} />

            <Text style={styles.sectionTitle}>Symptoms</Text>
            <ScrollView style={styles.scrollView}>
                {Object.keys(categories).map(category => (
                    <View key={category} style={styles.categoryContainer}>
                        <TouchableOpacity onPress={() => toggleDropdown(category)} style={styles.categoryButton}>
                            <Text style={styles.categoryButtonText}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                            <Ionicons name={dropdowns[category] ? 'chevron-up' : 'chevron-down'} size={20} color="#009688" />
                        </TouchableOpacity>
                        {dropdowns[category] && (
                            <View style={styles.symptomList}>
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

            <View style={styles.footer}>
                <Button title="Save" onPress={handleSave} />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#009688',
        padding: 16,
        marginBottom: 16,
    },
    button: {
        color: '#fff',
        fontSize: 16,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
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
    },
});

export default Track;
