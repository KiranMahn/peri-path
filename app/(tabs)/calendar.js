import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Month from '../widgets/calendar/month';
import { useNavigation } from '@react-navigation/native';
import { SettingsContext } from '../settings-context'; 
import Nav from '../widgets/nav';
import symptomsData from '../../symptoms.json'; 

// The Calendar screen
const Calendar = () => {
    const date = new Date();
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const navigation = useNavigation();
    const { settings } = useContext(SettingsContext);

    // Handles when the user clickes on the left arrow to display the previous month
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Handles when the user clickes on the right arrow to display the previous month
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Handles the user clicking on a day in the calendar and retreives the users tracked data for that day to display in the detail view
    const handleDayClick = ([dateString, dayData]) => {
        setSelectedDayData(dayData);
        setSelectedDate(dateString);
        console.log("Selected day data: ", dayData);
        console.log("dateString: ", dateString);
    };

    // Get the formatted symptom name from the slider key eg. "brainfog" -> "Brain Fog"
    const getSymptomName = (sliderKey) => {
        const symptom = symptomsData.symptoms.find((symptom) => symptom.key === sliderKey);
        return symptom ? symptom.symptom : sliderKey; 
    };

    return (
        <View style={[styles.container, { backgroundColor: settings.highContrast ? 'black' : 'white' }]}>

            {/* Header of the calendar page with left right buttons and the current date */}
            <View style={styles.navigation}>

                {/* Previous month button */}
                <TouchableOpacity onPress={handlePrevMonth} style={[styles.navButton, { backgroundColor: settings.highContrast ? 'black' : 'white' }]}>
                    <Text style={[styles.navButtonText, { fontSize: settings.largeText ? 19 : 14, color: settings.highContrast ? 'white' : 'black' }]}>{'<'}</Text>
                </TouchableOpacity>
                
                {/* Displays current date */}
                <Text style={[styles.navText, { fontSize: settings.largeText ? 25 : 20, color: settings.highContrast ? 'white' : 'black'  }]}>{`${currentMonth + 1}/${currentYear}`}</Text>

                {/* Next month button */}
                <TouchableOpacity onPress={handleNextMonth} style={[styles.navButton, { backgroundColor: settings.highContrast ? 'black' : 'white' }]}>
                    <Text style={[styles.navButtonText, { fontSize: settings.largeText ? 19 : 14, color: settings.highContrast ? 'white' : 'black'  }]}>{'>'}</Text>
                </TouchableOpacity>

            </View>


            {/* Calendar month Widget in the middle of the screen */}
            <Month month={currentMonth} year={currentYear} onDayClick={handleDayClick} />


            {/* Detail view of the selected day that pops up on the bottom third of the screen when a day is pressed */}
            {selectedDayData && 
                <View style={styles.detailView}>

                    {/* Header of the detail view with the day the symptom was tracked */}
                    <Text style={[styles.detailHeader, { fontSize: settings.largeText ? 25 : 20 }]}>
                        Tracked on {selectedDate}
                    </Text>

                    <ScrollView contentContainerStyle={styles.dayDataContainer}>

                        {/* For each tracked symptom that day */}
                        {Object.keys(selectedDayData)
                            .filter(slider => (selectedDayData[slider] !== 'None') && (selectedDayData[slider] !== ''))
                            .map((slider) => (

                                <View key={slider} style={[styles.dayDataItem]}>

                                    {/* Displays the symptom name */}
                                    <Text style={[styles.dayDataText, { fontSize: settings.largeText ? 22 : 17 }]}>
                                        {getSymptomName(slider)}:
                                    </Text>

                                    {/* Displays the symptom value */}   
                                    <Text style={[styles.dayDataValue, { fontSize: settings.largeText ? 22 : 17 }]}>
                                         {" " + selectedDayData[slider]}
                                    </Text>

                                </View>

                            ))}

                        {/* Handle no data case */}
                         {(Object.keys(selectedDayData).length === 0)  &&
                            <Text style={[styles.dayDataValue, { fontSize: settings.largeText ? 22 : 17 }]}>
                                No data tracked on this day.
                            </Text>
                        } 

                    </ScrollView>

                    {/* Edit button takes user straight to track with the date of the box they clicked on preset */}
                    <TouchableOpacity style={styles.trackMoreButton} onPress={() => navigation.navigate('Track', { date: selectedDate })}>
                        <Text style={[styles.trackMoreText, { fontSize: settings.largeText ? 20 : 15 }]}>Edit</Text>
                    </TouchableOpacity>

                </View>
            }

            {/* Navigation bar */}
            <Nav />
            
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