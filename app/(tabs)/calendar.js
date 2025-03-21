import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Month from '../widgets/calendar/month';
const Calendar = () => {
    const date = new Date();
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [selectedDayData, setSelectedDayData] = useState(null);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDayClick = (dayData) => {
        setSelectedDayData(dayData);
        console.log("Selected day data: ", dayData);
    };

    const getColor = (status) => {
        switch (status) {
            case 'Low':
                return 'green';
            case 'Medium':
                return 'orange';
            case 'High':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Calendar</Text>
            </View>
            <View style={styles.navigation}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text>{`${currentMonth + 1}/${currentYear}`}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                    <Text>{'>'}</Text>
                </TouchableOpacity>
            </View>
            <Month month={currentMonth} year={currentYear} onDayClick={handleDayClick} />

            {selectedDayData && (
                <View style={styles.dayDataContainer}>
                    {Object.keys(selectedDayData).filter(slider => (selectedDayData[slider] !== 'None') && (selectedDayData[slider] !== '')).map((slider) => (
                        <View key={slider} style={[styles.dayDataItem, { backgroundColor: getColor(selectedDayData[slider]) }]}> 
                            <Text style={styles.dayDataText}>{slider}: {selectedDayData[slider]}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#009688',
        padding: 20,
        width: '100%',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 20,
    },
    navButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    dayDataContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    dayDataItem: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    dayDataText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Calendar;
