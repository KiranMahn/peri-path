import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsContext } from '@/app/settings-context';
const screenWidth = Dimensions.get('window').width;

// period line chart 

const PeriodChart = () => {
    const [chartData, setChartData] = useState(null);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 14)));
    const [endDate, setEndDate] = useState(new Date());
    const [selectedRange, setSelectedRange] = useState('2weeks');
    const [maxYValue, setMaxYValue] = useState(0); 
    const { settings } = useContext(SettingsContext); 

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
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d));
            }

            let symptomsCount = dateArray.map(date => {

                const dateString = date.toDateString();
                const dayData = userData[dateString] || {};
                const severity = dayData['period'] ? severityLevels[dayData['period']] : 0;

                return severity;

            });

            let averagedSymptomsCount = [];
            let averagedLabels = [];
            let labels = [];

            if (selectedRange === '2weeks') {

                averagedSymptomsCount = [];

                for (let i = 0; i < symptomsCount.length; i += 2) {
                    const avg = (symptomsCount[i] + (symptomsCount[i + 1] || 0)) / 2;
                    averagedSymptomsCount.push(avg);
                }

                symptomsCount = averagedSymptomsCount;
                console.log("Averaged symptomsCount", symptomsCount);

                labels = dateArray.map(date => `${date.getMonth() + 1}/${date.getDate()}`);
                averagedLabels = [];

                for (let i = 0; i < labels.length; i += 2) {
                    averagedLabels.push(labels[i]);
                }

            }

            if (selectedRange === '2months') {

                averagedSymptomsCount = [];

                for (let i = 0; i < symptomsCount.length; i += 7) {

                    const chunk = symptomsCount.slice(i, i + 7); 
                    const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
                    averagedSymptomsCount.push(avg);

                }

                symptomsCount = averagedSymptomsCount;
                console.log("Averaged symptomsCount", symptomsCount);

                labels = dateArray.map(date => `${date.getMonth() + 1}/${date.getDate()}`);

                for (let i = 0; i < labels.length; i += 7) {

                    averagedLabels.push(labels[i]); 

                }
            }

            if (selectedRange === '1year') {

                const monthlySymptomsCount = [];
                const monthlyLabels = [];
            
                for (let month = 0; month < 12; month++) {

                    const monthData = dateArray.filter(date => date.getMonth() === month && date <= endDate); 

                    const monthSymptoms = monthData.map(date => {

                        const dateString = date.toDateString();
                        const dayData = userData[dateString] || {};
                        return dayData['period'] ? severityLevels[dayData['period']] : 0;

                    });
            
                    if (monthSymptoms.length > 0) {

                        const avg = monthSymptoms.reduce((sum, val) => sum + val, 0) / monthSymptoms.length;
                        monthlySymptomsCount.push(avg);
                        monthlyLabels.push(`${monthData[0].toLocaleString('default', { month: 'short' })}`);

                    } else {

                        monthlySymptomsCount.push(0);
                        const year = startDate.getFullYear();
                        monthlyLabels.push(new Date(year, month).toLocaleString('default', { month: 'short' }));

                    }
                }
            
                symptomsCount = monthlySymptomsCount;
                averagedLabels = monthlyLabels;
            }            

            setChartData({
                labels: averagedLabels,
                datasets: [
                    {
                        data: symptomsCount,
                        color: (opacity = 1) => `rgba(337, 106, 94, ${opacity})`, 
                        strokeWidth: 2 
                    }
                ], 
                legend: ["Period Flow Over Time"] 
            });

            let max = Math.max(...symptomsCount);
            let integerMax = Math.ceil(max);
            setMaxYValue(integerMax); 

        };

        loadUserData();
        logAsyncStorage(); 
        
    }, [startDate, endDate]);

    const formatYLabel = (value) => {
       
        let numVal = parseFloat(value);
            if (numVal == 0){
                console.log("no period")
                return 'None';
            } else if(numVal <= 1){
                console.log("spotting")
                return 'Spotting';
            } else if(numVal <= 2){
                console.log("light period")
                return 'Light';
            } else if(numVal <= 3){
                console.log("medium period")
                return 'Medium';
            } else if(numVal <= 4){
                console.log("heavy period")
                return 'Heavy';
            }
               
    };

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
                    width={screenWidth * 0.95} 
                    height={220}
                    chartConfig={{
                        backgroundColor: settings.highContrast ? 'rgb(55, 55, 55)': '#f4f3f3',
                        backgroundGradientFrom: settings.highContrast ? 'rgb(55, 55, 55)': '#f4f3f3',
                        backgroundGradientTo: settings.highContrast ? 'rgb(55, 55, 55)': '#f4f3f3',
                        decimalPlaces: 0, 
                        color: settings.highContrast ? (opacity = 1) => `rgba(223,89,83, 1)` : (opacity = 1) => `rgba(229,83,83, ${opacity})`,
                        labelColor: settings.highContrast ? (opacity = 1) => `rgb(255, 255, 255)` : (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: 'rgb(223, 89, 83)'
                        },
                        propsForBackgroundLines: {
                            strokeDasharray: '', 
                        },
                        formatXLabel: (label, index) => {

                            if (selectedRange === '2weeks') {
                                return index % 2 === 0 ? label : '';
                            }
                            
                            return label;

                        },
                    }}
                    formatYLabel={formatYLabel}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    segments={maxYValue | 1}
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

export default PeriodChart;