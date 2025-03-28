import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Month from '../widgets/calendar/month';
import { useNavigation } from '@react-navigation/native';
import { SettingsContext } from '../settings-context'; // Import SettingsContext

const Calendar = () => {
    const date = new Date();
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigation = useNavigation();
    const { settings } = useContext(SettingsContext); // Access settings from context

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

    const handleDayClick = ([dateString, dayData]) => {
        setSelectedDayData(dayData);
        setSelectedDate(dateString);
        console.log("Selected day data: ", dayData);
        console.log("dateString: ", dateString);
    };

    return (
        <View style={styles.container}>
            <View style={styles.navigation}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                    <Text style={[styles.navButtonText, { fontSize: settings.largeText ? 19 : 14 }]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[styles.navText, { fontSize: settings.largeText ? 25 : 20 }]}>{`${currentMonth + 1}/${currentYear}`}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                    <Text style={[styles.navButtonText, { fontSize: settings.largeText ? 19 : 14 }]}>{'>'}</Text>
                </TouchableOpacity>
            </View>
            <Month month={currentMonth} year={currentYear} onDayClick={handleDayClick} />
            {selectedDayData && 
                <View style={styles.detailView}>
                    <Text style={[styles.detailHeader, { fontSize: settings.largeText ? 25 : 20 }]}>
                        Tracked on {selectedDate}
                    </Text>
                    <ScrollView contentContainerStyle={styles.dayDataContainer}>
                        {Object.keys(selectedDayData)
                            .filter(slider => (selectedDayData[slider] !== 'None') && (selectedDayData[slider] !== ''))
                            .map((slider) => (
                                <View key={slider} style={[styles.dayDataItem]}>
                                    <Text style={[styles.dayDataText, { fontSize: settings.largeText ? 22 : 17 }]}>
                                        {slider}:
                                    </Text>
                                    <Text style={[styles.dayDataValue, { fontSize: settings.largeText ? 22 : 17 }]}>
                                        {selectedDayData[slider]}
                                    </Text>
                                </View>
                            ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.trackMoreButton} onPress={() => navigation.navigate('Track')}>
                        <Text style={[styles.trackMoreText, { fontSize: settings.largeText ? 20 : 15 }]}>Edit</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    navButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    navText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detailView: {
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
        backgroundColor: 'rgb(223, 223, 223)',
        paddingTop: 20,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        alignSelf: 'flex-start',
        padding: 10,
        bottom: 0,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 3, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        maxHeight: '40%',
    },
    detailHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
    },
    dayDataContainer: {
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
    },
    dayDataItem: {
        padding: 2,
        borderRadius: 5,
        marginVertical: 2,
        width: '100%',
        alignItems: 'start',
        margin: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    dayDataText: {
        color: 'rgb(88, 88, 88)',
        fontWeight: 'bold',
        fontSize: 17,
    },
    dayDataValue: {
        fontSize: 17,
        color: 'rgb(88, 88, 88)',
    },
    trackMoreButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#009688',
        borderRadius: 15,
        alignSelf: 'center',
        width: '50%',
        alignItems: 'center',
        marginBottom: 15
    },
    trackMoreText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default Calendar;