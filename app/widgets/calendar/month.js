import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Entypo';

const Month = ({ month, year, onDayClick }) => {
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [userData, setUserData] = useState({});
    const [monthYear, setMonthYear] = useState('');
    const [username, setUsername] = useState('Unknown User');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
                setUsername(currentUser ? currentUser.username : 'Unknown User');

                // Calculate the number of days in the given month
                const days = new Date(year, month + 1, 0).getDate();
                const daysArray = Array.from({ length: days }, (_, i) => {
                    return new Date(year, month, i + 1);
                });
                setDaysInMonth(daysArray);

                const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {};
                setUserData(allUsersData[username] || {});
                console.log("userdata", userData);

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

        // console.log("dayData", dayData);
        const symptomKeys = Object.keys(dayData).filter(slider => (dayData[slider] !== 'None') && (dayData[slider] !== ''));
        const symptomDots = symptomKeys.slice(0, 4).map((slider) => (
            <View key={slider} style={[styles.symptomDot, { backgroundColor: getColor(dayData[slider]) }]} />
        ));
        const showPlus = symptomKeys.length > 4;

        return (
            <TouchableOpacity key={dateString} onPress={() => onDayClick(dayClickData)} style={styles.dayBox}>
                <Text style={styles.dayText}>{day.getDate()}</Text>
                {periodLevel && <View style={[styles.periodIndicator, { backgroundColor: getPeriodColor(periodLevel) }]} />}
                <View style={styles.symptomIndicators}>
                    {symptomDots}
                    {showPlus && <Ionicons name="circle-with-plus" size={8} color="red" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{monthYear}</Text>
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