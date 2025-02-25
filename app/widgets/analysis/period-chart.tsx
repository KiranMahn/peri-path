import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { SettingsContext } from '../../settings-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PeriodChart = () => {
    const [chartData, setChartData] = useState<any>(null);
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const settingsContext = useContext(SettingsContext);
    const settings = settingsContext ? settingsContext.settings : {};
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const getData = async () => {
            const currentUser = JSON.parse(await AsyncStorage.getItem('user') || '{}');
            const username = currentUser ? currentUser.username : 'Unknown User';
            const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData') || '{}');
            const userData = allUsersData[username] || {};

            const severityLevels: {
                ' ': number;
                Spotting: number;
                Light: number;
                Medium: number;
                Heavy: number;
            } = {
                ' ': 0,
                Spotting: 1,
                Light: 2,
                Medium: 3,
                Heavy: 4,
            };
                        
            const [startDate, endDate] = dateRange;
            const dateArray: Date[] = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d));
            }

            const symptoms = dateArray.reduce((acc: any, date: Date) => {
                const dateString = date.toDateString(); // Format date as "Fri Jan 10"
                const dayData = userData[dateString] || {};
                const severity = dayData['period'] ? severityLevels[dayData['period'] as keyof typeof severityLevels] : 0;
    
                if (!acc['period']) {
                    acc['period'] = [];
                }
                acc['period'].push({ date: new Date(dateString), severity });
    
                return acc;
            }, {});

            const datasets = Object.keys(symptoms).map(symptom => ({
                label: symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                data: symptoms[symptom].map((entry: any) => ({ x: entry.date, y: entry.severity })),
                fill: false,
                borderColor: 'red',
            }));

            setChartData({
                datasets,
            });
        };

        getData();
    }, [dateRange]);


    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || new Date();
        if (showStartDatePicker) {
            setStartDate(currentDate);
            setDateRange([currentDate, endDate]);
        } else if (showEndDatePicker) {
            setEndDate(currentDate);
            setDateRange([startDate, currentDate]);
        }
    };

    const showDatePicker = (isStartDate: boolean) => {
        if (isStartDate) {
            setShowStartDatePicker(true);
        } else {
            setShowEndDatePicker(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.datePickers}>
                <Button title={`Start Date: ${startDate.toDateString()}`} onPress={() => showDatePicker(true)} />
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Button title={`End Date: ${endDate.toDateString()}`} onPress={() => showDatePicker(false)} />
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            {chartData ? (
                <LineChart
                    data={chartData}
                    width={320} // from react-native-chart-kit
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726',
                        },
                    }}
                    style={{ marginVertical: 8, borderRadius: 16 }}
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    datePickers: {
        marginBottom: 20,
    }
});

export default PeriodChart;
