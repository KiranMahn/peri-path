import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Entypo';
import { SettingsContext } from '../../settings-context'; 

// used in the calendar screen to show the month 
const Month = ({ month, year, onDayClick }) => {
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [userData, setUserData] = useState({});
    const [monthYear, setMonthYear] = useState('');
    const [username, setUsername] = useState('Unknown User');
    const { settings } = useContext(SettingsContext); 

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
                setUsername(currentUser ? currentUser.username : 'Unknown User');

                const days = new Date(year, month + 1, 0).getDate();
                const daysArray = Array.from({ length: days }, (_, i) => {
                    return new Date(year, month, i + 1);
                });

                setDaysInMonth(daysArray);

                const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {};
                setUserData(allUsersData[username] || {});

                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                setMonthYear(`${monthNames[month]} ${year}`);

            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, [month, year]);

    const getPeriodColor = (periodLevel) => {
        switch (periodLevel) {
            case 'Light': return 'lightcoral';
            case 'Medium': return 'red';
            case 'Heavy': return 'darkred';
            case 'Spotting': return 'pink';
            default: return 'transparent';
        }
    };

    const getColor = (severity) => {
        switch (severity) {
            case 'Low': return 'orange';
            case 'Medium': return 'red';
            case 'High': return 'maroon';
            default: return 'transparent';
        }
    };

    const renderDayBox = (day) => {
        const dateString = day.toDateString();
        const dayData = userData[dateString] || {};
        const periodLevel = dayData.period;

        const dayClickData = [dateString, dayData];

        const symptomKeys = Object.keys(dayData).filter(slider => (dayData[slider] !== 'None') && (dayData[slider] !== ''));
        const symptomDots = symptomKeys.slice(0, 4).map((slider) => (
            <View key={slider} style={[styles.symptomDot, { backgroundColor: getColor(dayData[slider]) }]} />
        ));

        const showPlus = symptomKeys.length > 4;
        const isFutureDate = day > new Date(); 

        return (
            <TouchableOpacity
                key={dateString}
                onPress={!isFutureDate ? () => onDayClick(dayClickData) : null} // Disable onPress for future dates
                style={[
                    styles.dayBox,
                    isFutureDate && styles.futureDayBox, // Apply greyed-out style for future dates
                    isFutureDate && settings.highContrast && styles.hcfutureDayBox, // Apply greyed-out style for future dates
                ]}
            >

                <Text
                    style={[
                        styles.dayText,
                        { fontSize: settings.largeText ? 19 : 14, color: settings.highContrast && isFutureDate ? 'rgb(142, 142, 142)' : settings.highContrast ? 'white' : isFutureDate ? '#ccc' : 'black' }, // Grey out text for future dates
                    ]}
                >
                    {day.getDate()}
                </Text>

                {!isFutureDate && periodLevel && (
                    <View style={[styles.periodIndicator, { backgroundColor: getPeriodColor(periodLevel) }]} />
                )}

                <View style={styles.symptomIndicators}>

                    {!isFutureDate && symptomDots}
                    {!isFutureDate && showPlus && <Ionicons name="circle-with-plus" size={8} color="red" />}

                </View>

            </TouchableOpacity>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            
            <Text style={[styles.header, { fontSize: settings.largeText ? 25 : 20, color: settings.highContrast ? 'white' : 'black' }]}>{monthYear}</Text>
            <View style={styles.grid}>{daysInMonth.map((day) => renderDayBox(day))}</View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 300,
    },
    dayBox: {
        width: 50,
        height: 50,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        position: 'relative',
    },
    futureDayBox: {
        backgroundColor: '#f0f0f0', 
        borderColor: '#ddd', 
    },
    hcfutureDayBox: {
        backgroundColor: 'rgb(66, 66, 66)', 
        borderColor: 'rgb(39, 39, 39)', 
    },
    dayText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    periodIndicator: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    symptomIndicators: {
        position: 'absolute',
        bottom: 2,
        left: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    symptomDot: {
        width: 6,
        height: 6,
        margin: 1,
        borderRadius: 3,
    },
});

export default Month;