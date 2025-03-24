import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Month from '../widgets/calendar/month';
import { useNavigation } from '@react-navigation/native';

const Calendar = () => {
    const date = new Date();
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigation = useNavigation();

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
            {selectedDayData && 
                <View style={styles.detailView}>
                    <Text style={{fontWeight: 'bold', fontSize: '20'}}>Tracked on {selectedDate}</Text>
                    <ScrollView contentContainerStyle={styles.dayDataContainer}>
                    {Object.keys(selectedDayData).filter(slider => (selectedDayData[slider] !== 'None') && (selectedDayData[slider] !== '')).map((slider) => (
                        <View key={slider} style={[styles.dayDataItem]}>
                            <Text style={styles.dayDataText}> {slider}: </Text>
                            <Text style={{fontSize: 17}}>{selectedDayData[slider]}</Text>
                        </View>
                    ))}
                    {/* {selectedDayData.period && (
                        <View style={[styles.dayDataItem]}>
                            <Text style={styles.dayDataText}>Period: {selectedDayData.period}</Text>
                        </View>
                    )} */}
                    </ScrollView>
                    
                    <TouchableOpacity style={styles.trackMoreButton} onPress={() => navigation.navigate('TrackSymptoms')}>
                        <Text style={styles.trackMoreText}>Edit</Text>
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
    detailView: {
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 20,
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
    },
    navButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    dayDataContainer: {
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
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
    trackMoreButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#009688',
        borderRadius: 15,
        alignSelf: 'center',
        width: '50%',
        alignItems: 'center',
    },
    trackMoreText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Calendar;