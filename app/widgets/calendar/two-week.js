import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Entypo';
import { SettingsContext } from '../../settings-context'; // Import SettingsContext

const TwoWeek = () => {
    const navigation = useNavigation();
    const [daysInTwoWeeks, setDaysInTwoWeeks] = useState([]);
    const [userData, setUserData] = useState({});
    const [dateRange, setDateRange] = useState('');
    const [username, setUsername] = useState('Unknown User');
    const { settings } = useContext(SettingsContext); // Access settings from context

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
                setUsername(currentUser ? currentUser.username : 'Unknown User');

                // Calculate the last 14 days from today
                const today = new Date();
                const start = new Date(today);
                start.setDate(today.getDate() - 13); // Go back 13 days to include today
                const daysArray = Array.from({ length: 14 }, (_, i) => {
                    const newDate = new Date(start);
                    newDate.setDate(start.getDate() + i);
                    return newDate;
                });
                setDaysInTwoWeeks(daysArray);

                const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {};
                setUserData(allUsersData[username] || {});

                const formatDate = (date) => {
                    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                };

                setDateRange(`${formatDate(start)} to ${formatDate(today)}`);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);

    const getColor = (status) => {
        switch (status) {
            case 'Low': return 'orange';
            case 'Medium': return 'red';
            case 'High': return 'maroon';
            default: return 'gray';
        }
    };

    const getPeriodColor = (level) => {
        switch (level) {
            case 'Light': return 'lightcoral';
            case 'Medium': return 'indianred';
            case 'Heavy': return 'darkred';
            case 'Spotting': return 'pink';
            default: return 'transparent';
        }
    };

    const renderDayBox = (day) => {
        const dateString = day.toDateString();
        const dayData = userData[dateString] || {};
        const periodLevel = dayData.period;

        const symptomKeys = Object.keys(dayData).filter(slider => (dayData[slider] !== 'None') && (dayData[slider] !== ''));
        const symptomDots = symptomKeys.slice(0, 4).map((slider) => (
            <View key={slider} style={[styles.symptomDot, { backgroundColor: getColor(dayData[slider]) }]} />
        ));
        const showPlus = symptomKeys.length > 4;

        const isFutureDate = day > new Date(); // Check if the date is in the future

        // Get the first letter of the day of the week (e.g., "M" for Monday)
        const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

        return (
            <TouchableOpacity
                key={dateString}
                onPress={!isFutureDate ? () => navigation.navigate('Track', { date: day }) : null} // Disable onPress for future dates
                style={[
                    styles.dayBox,
                    isFutureDate && styles.futureDayBox, // Apply greyed-out style for future dates
                ]}
                testID="dayBox"
            >
                {/* Day of the week in the top-left corner */}
                <Text style={[styles.dayOfWeek, {color: settings.highContrast ? 'white' : 'rgb(173, 173, 173)'}]}>{dayOfWeek}</Text>

                <Text
                    style={[
                        styles.dayText,
                        { fontSize: settings.largeText ? 17 : 14, color: isFutureDate ? '#ccc' : settings.highContrast ? '#fff' : '#000' }, // Grey out text for future dates
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
            <Text style={[styles.header, { fontSize: settings.largeText ? 23 : 20, color: settings.highContrast ? '#fff' : '#000' }]}>{dateRange}</Text>
            <View style={styles.grid}>{daysInTwoWeeks.map((day) => renderDayBox(day))}</View>
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
        backgroundColor: '#f0f0f0', // Greyed-out background for future dates
        borderColor: '#ddd', // Lighter border for future dates
    },
    dayText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dayOfWeek: {
        position: 'absolute',
        top: 2,
        left: 2,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666', // Color for the day of the week
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
        alignItems: 'center',
    },
    symptomDot: {
        width: 6,
        height: 6,
        margin: 1,
        borderRadius: 3,
    },
    plusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'black',
        margin: 1,
    },
});

export default TwoWeek;