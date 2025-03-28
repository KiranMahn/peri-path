import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import symptomsData from '../../../symptoms.json';
import { SettingsContext } from '../../settings-context'; // Import SettingsContext

const screenWidth = Dimensions.get('window').width;

const SymptomChart = () => {
    const [chartData, setChartData] = useState(null);
    const { settings } = useContext(SettingsContext); // Access settings from context

    // Set the default date range to the past two weeks
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    const [startDate, setStartDate] = useState(twoWeeksAgo);
    const [endDate, setEndDate] = useState(today);
    const [selectedRange, setSelectedRange] = useState('2weeks');
    const [maxSymptomValue, setMaxSymptomValue] = useState(0);
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

            const start = new Date(startDate);
            const end = new Date(endDate);

            const dateArray = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d));
            }

            let symptomsCount = dateArray.map(date => {
                const dateString = date.toDateString();
                const dayData = userData[dateString] || {};
                const symptomsTracked = Object.keys(dayData).filter(symptom => symptom !== 'period' && symptom !== 'symptoms' && dayData[symptom] !== 'None').length;
                return symptomsTracked;
            });

            let averagedLabels = [];
            let labels = [];

            if (selectedRange === '2weeks') {
                // Average data for every 2 days
                const averagedSymptomsCount = [];
                for (let i = 0; i < symptomsCount.length; i += 2) {
                    const avg = (symptomsCount[i] + (symptomsCount[i + 1] || 0)) / 2;
                    averagedSymptomsCount.push(avg);
                }
                symptomsCount = averagedSymptomsCount;

                labels = dateArray.map(date => `${date.getMonth() + 1}/${date.getDate()}`);
                for (let i = 0; i < labels.length; i += 2) {
                    averagedLabels.push(labels[i]);
                }
            }

            if (selectedRange === '2months') {
                // Average data for every 7 days
                const averagedSymptomsCount = [];
                for (let i = 0; i < symptomsCount.length; i += 7) {
                    const chunk = symptomsCount.slice(i, i + 7); // Get a chunk of 7 days
                    const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length; // Calculate the average
                    averagedSymptomsCount.push(avg);
                }
                symptomsCount = averagedSymptomsCount;
            
                labels = dateArray.map(date => `${date.getMonth() + 1}/${date.getDate()}`);
                for (let i = 0; i < labels.length; i += 7) {
                    averagedLabels.push(labels[i]); // Use the first label of each 4-day interval
                }
            }

            if (selectedRange === '1year') {
                // Average data for each month in the past 12 months
                const monthlySymptomsCount = [];
                const monthlyLabels = [];
            
                for (let month = 0; month < 12; month++) {
                    const monthData = dateArray.filter(date => date.getMonth() === month && date <= endDate); // Filter dates up to endDate
                    const monthSymptoms = monthData.map(date => {
                        const dateString = date.toDateString();
                        const dayData = userData[dateString] || {};
                        return Object.keys(dayData).filter(symptom => symptom !== 'period' && symptom !== 'symptoms' && dayData[symptom] !== 'None').length;
                    });
            
                    if (monthSymptoms.length > 0) {
                        const avg = monthSymptoms.reduce((sum, val) => sum + val, 0) / monthSymptoms.length;
                        monthlySymptomsCount.push(avg);
                        monthlyLabels.push(`${monthData[0].toLocaleString('default', { month: 'short' })}`);
                    } else {
                        // If no data for the month, push 0
                        monthlySymptomsCount.push(0);
                        monthlyLabels.push(new Date(startDate.getFullYear(), month).toLocaleString('default', { month: 'short' }));
                    }
                }
            
                symptomsCount = monthlySymptomsCount;
                averagedLabels = monthlyLabels;
            }

           
            

            

            console.log("averageLabels", averagedLabels);
            setChartData({
                labels: averagedLabels,
                datasets: [
                    {
                        data: symptomsCount,
                    }
                ], 
                legend: ["Symptom Severity Over Time"] // optional

            });
            console.log("chart data", chartData);
            console.log("symptomsCount", symptomsCount);
            setMaxSymptomValue(Math.max(...symptomsCount));
        };

        loadUserData();
        logAsyncStorage(); // Log AsyncStorage data

    }, [startDate, endDate]);

    console.log("maxSymptomValue", maxSymptomValue);

    return (
        <View style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
            <View style={{ marginBottom: '1em', width: '70vw', textAlign: 'center' }}>
                <View style={{ marginTop: '1em', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <Button
                        title="Past 2 Weeks"
                        onPress={() => handleDateRangeChange('2weeks')}
                        color={selectedRange === '2weeks' ? '#009688' : '#ccc'}
                        accessibilityLabel="Symptom data for the past 2 weeks"
                    />
                    <Button
                        title="Past 2 Months"
                        onPress={() => handleDateRangeChange('2months')}
                        color={selectedRange === '2months' ? '#009688' : '#ccc'}
                        accessibilityLabel='Symptom data for the past 2 months'
                    />
                    <Button
                        title="Past Year"
                        onPress={() => handleDateRangeChange('1year')}
                        color={selectedRange === '1year' ? '#009688' : '#ccc'}
                        accessibilityLabel='Symptom data for the past year'
                    />
                </View>
            </View>
            {chartData ? (
                <LineChart
                    data={chartData}
                    width={screenWidth * 0.95} // from react-native
                    height={220}
                    chartConfig={{
                        backgroundColor: settings.highContrast ? 'rgb(55, 55, 55)': '#f4f3f3',
                        backgroundGradientFrom: settings.highContrast ? 'rgb(55, 55, 55)': '#f4f3f3',
                        backgroundGradientTo: settings.highContrast ? 'rgb(55, 55, 55)': '#f4f3f3',
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: settings.highContrast ? (opacity = 1) => `rgba(0, 150, 136, 1)` : (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
                        labelColor: settings.highContrast ? (opacity = 1) => `rgb(255, 255, 255)` : (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16, 
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
                                // Show only every 2nd label to match the averaged data points
                                return index % 2 === 0 ? label : '';
                            }
                            return label;
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16, 
                    }}
                    segments={maxSymptomValue | 1}
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