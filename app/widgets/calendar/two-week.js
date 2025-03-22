import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TwoWeek = () => {
    const navigation = useNavigation();
    const [daysInTwoWeeks, setDaysInTwoWeeks] = useState([]);
    const [userData, setUserData] = useState({});
    const [dateRange, setDateRange] = useState('');
    const [username, setUsername] = useState('Unknown User');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
                setUsername(currentUser ? currentUser.username : 'Unknown User');

                const date = new Date();
                const start = new Date(date.setDate(date.getDate() - date.getDay()));
                const daysArray = Array.from({ length: 14 }, (_, i) => {
                    const newDate = new Date(start);
                    newDate.setDate(start.getDate() + i);
                    return newDate;
                });
                setDaysInTwoWeeks(daysArray);

                const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {};
                setUserData(allUsersData[currentUser?.username] || {});

                const end = new Date(start);
                end.setDate(start.getDate() + 13);

                const formatDate = (date) => {
                    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                };

                setDateRange(`${formatDate(start)} to ${formatDate(end)}`);
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

        return (
            <TouchableOpacity key={dateString} onPress={() => navigation.navigate('Calendar')} style={styles.dayBox}>
                <Text style={styles.dayText}>{day.getDate()}</Text>
                {periodLevel && <View style={[styles.periodIndicator, { backgroundColor: getPeriodColor(periodLevel) }]} />}
                <View style={styles.symptomIndicators}>
                    {Object.keys(dayData).filter(slider => (dayData[slider] !== 'None') && (dayData[slider] !== '')).map((slider) => (
                        <View key={slider} style={[styles.symptomDot, { backgroundColor: getColor(dayData[slider]) }]} />
                    ))}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{dateRange}</Text>
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
    dayText: {
        fontSize: 14,
        fontWeight: 'bold',
        top: 0
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

export default TwoWeek;
