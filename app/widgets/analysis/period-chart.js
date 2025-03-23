import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import symptomsData from '../../../symptoms.json';

const screenWidth = Dimensions.get('window').width;

const SymptomChart = () => {
    const [chartData, setChartData] = useState(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [dropdowns, setDropdowns] = useState({
        cognitive: false,
        emotional: false,
        physical: false,
        dermatological: false,
        other: false
    });

    // Set the default date range to the past two weeks
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    const [startDate, setStartDate] = useState(twoWeeksAgo);
    const [endDate, setEndDate] = useState(today);
    const [selectedRange, setSelectedRange] = useState('2weeks');

    const handleDateRangeChange = (range) => {
        const newEndDate = new Date();
        let newStartDate = new Date();
        if (range === '2weeks') {
            newStartDate.setDate(newEndDate.getDate() - 14);
        } else if (range === '2months') {
            newStartDate.setMonth(newEndDate.getMonth() - 2);
        } else if (range === '1year') {
            newStartDate.setFullYear(newEndDate.getFullYear() - 1);
        }
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setSelectedRange(range);
    };

    const logAsyncStorage = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            result.forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
        } catch (error) {
            console.error('Error logging AsyncStorage data:', error);
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
            const username = currentUser ? currentUser.username : 'Unknown User';
            const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {};
            const userData = allUsersData[username] || {};

            const severityLevels = {
                ' ': 0,
                'Spotting': 1,
                'Light': 2,
                'Medium': 3,
                'Heavy': 4
            };

            const start = new Date(startDate);
            const end = new Date(endDate);

            const dateArray = [];
            const symptomArray = [];

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d));
            }
            const symptoms = dateArray.reduce((acc, date) => {
                const dateString = date.toDateString();
                const dayData = userData[dateString] || {};
                const entryDate = new Date(date);
                const severity = dayData['period'] ? severityLevels[dayData['period']] : 0;

                if (!acc['period']) {
                    acc['period'] = [];
                }
                acc['period'].push({ date: new Date(dateString), severity });
                console.log("period acc", acc);
                return acc;

                // Object.keys(dayData).forEach(symptom => {
                //     if (symptom !== 'period' && symptom !== 'symptoms') {
                //         const formattedSymptom = symptom.toLowerCase().replace(/\s+/g, '');
                //         if (!acc[formattedSymptom]) {
                //             acc[formattedSymptom] = [];
                //         }
                //         if (!symptomArray.includes(formattedSymptom)) {
                //             symptomArray.push(formattedSymptom);
                //         }
                //         acc[formattedSymptom].push({ date: entryDate, severity: severityLevels[dayData[symptom]] ? severityLevels[dayData[symptom]] : 0});
                //     }
                // });

                // if(Object.keys(dayData).length === 0) {
                //     symptomArray.forEach(symptom => {
                //         acc[symptom].push({ date: date, severity: 0});
                //     });
                // }

                // return acc;
            }, {});

            // Ensure all possible symptoms are included in the datasets
            // symptomsData.symptoms.forEach(({ symptom }) => {
            //     const formattedSymptom = symptom.toLowerCase().replace(/\s+/g, '');
            //     if (!symptoms[formattedSymptom]) {
            //         symptoms[formattedSymptom] = [];
            //     }
            // });

            // Generate unique random colors with hue between green and purple
            const generateRandomColor = () => {
                const hue = Math.floor(Math.random() * (300 - 120 + 1)) + 120; // Hue between 120 (green) and 300 (purple)
                const saturation = 25 + 70 * Math.random();
                const lightness = Math.floor(Math.random() * (75 - 40 + 1)) + 40; // Lightness between 60 and 90
                return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            };

            const usedColors = new Set();
            const getUniqueColor = () => {
                let color;
                do {
                    color = generateRandomColor();
                } while (usedColors.has(color));
                usedColors.add(color);
                return color;
            };

            const datasets = Object.keys(symptoms).map(symptom => ({
                label: symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                data: symptoms[symptom].map(entry => entry.severity),
                color: (opacity = 1) => getUniqueColor(),
            }));

            const labels = dateArray.map(date => `${date.getMonth() + 1}/${date.getDate()}`);

            setChartData({
                labels,
                datasets,
            });
            console.log("chartData", chartData);
        };

        loadUserData();
        logAsyncStorage(); // Log AsyncStorage data

    }, [startDate, endDate]);

    return (
        <View style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
            <View style={{ marginBottom: '1em', width: '70vw', textAlign: 'center' }}>
                <View style={{ marginTop: '1em', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <Button
                        title="Past 2 Weeks"
                        onPress={() => handleDateRangeChange('2weeks')}
                        color={selectedRange === '2weeks' ? '#009688' : '#ccc'}
                    />
                    <Button
                        title="Past 2 Months"
                        onPress={() => handleDateRangeChange('2months')}
                        color={selectedRange === '2months' ? '#009688' : '#ccc'}
                    />
                    <Button
                        title="Past Year"
                        onPress={() => handleDateRangeChange('1year')}
                        color={selectedRange === '1year' ? '#009688' : '#ccc'}
                    />
                </View>
            </View>
            {chartData ? (
                <LineChart
                    data={chartData}
                    width={screenWidth * 0.95} // from react-native
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#009688'
                        },
                        propsForBackgroundLines: {
                            strokeDasharray: '', // solid background lines with no dashes
                        },
                        formatXLabel: (label, index) => {
                            if (selectedRange === '2weeks') {
                                // Show only every 5th label to avoid intersection
                                return index % 5 === 0 ? label : '';
                            }
                            return label;
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    segments={4}
                />
            ) : (
                <Text>Loading...</Text>
            )}
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

export default SymptomChart;