import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import symptomsData from '../../../symptoms.json';
import DatePicker from 'react-native-date-picker'

import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { View, Text, Input, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// Register the necessary components with Chart.js
ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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
    const chartRef = useRef(null);

    // Set the default date range to the past two weeks
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    const [tempdate, setTempDate] = useState(new Date());
    const [startDate, setStartDate] = useState(twoWeeksAgo.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const username = currentUser ? currentUser.username : 'Unknown User';
        const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || {};
        const userData = allUsersData[username] || {};

        const severityLevels = {
            'None': 0,
            'Low': 1,
            'Medium': 2,
            'High': 3
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

            Object.keys(dayData).forEach(symptom => {
                if (symptom !== 'period' && symptom !== 'symptoms') {
                    const formattedSymptom = symptom.toLowerCase().replace(/\s+/g, '');
                    if (!acc[formattedSymptom]) {
                        acc[formattedSymptom] = [];
                    }
                    if (!symptomArray.includes(formattedSymptom)) {
                        symptomArray.push(formattedSymptom);
                    }
                    acc[formattedSymptom].push({ date: entryDate, severity: severityLevels[dayData[symptom]] ? severityLevels[dayData[symptom]] : 0});
                }
            });

            if(Object.keys(dayData).length === 0) {
                symptomArray.forEach(symptom => {
                    acc[symptom].push({ date: date, severity: 0});
                });
            }

            return acc;
        }, {});

        // Ensure all possible symptoms are included in the datasets
        symptomsData.symptoms.forEach(({ symptom }) => {
            console.log(symptom);
            const formattedSymptom = symptom.toLowerCase().replace(/\s+/g, '');
            if (!symptoms[formattedSymptom]) {
                symptoms[formattedSymptom] = [];
            }
        });

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
            Text: symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            data: symptoms[symptom].map(entry => ({ x: entry.date, y: entry.severity })),
            fill: false,
            borderColor: getUniqueColor(),
        }));

        setChartData({
            datasets,
        });

        // Cleanup function to destroy the chart instance
        return () => {
            if (chartRef.current && chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, [startDate, endDate]);

    return (
        <View style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
            <View style={{ marginBottom: '1em', width: '70vw', textAlign: 'center' }}>
                <Text>
                    Start Date:
                    <DatePicker
                        modal
                        open={open}
                        date={tempdate}
                        onConfirm={(date) => {
                            setOpen(false)
                            setStartDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}                       
                    />
                </Text>
                <Text>
                    End Date:
                    <DatePicker
                        modal
                        open={open}
                        date={tempdate}
                        onConfirm={(date) => {
                            setOpen(false)
                            setStartDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}                       
                    />
                </Text>
            </View>
            {chartData ? (
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day',
                                },
                                ticks: {
                                    callback: function(value) {
                                        const date = new Date(value);
                                        return `${date.getMonth() + 1}/${date.getDate()}`;
                                    }
                                },
                                grid: {
                                    display: false,
                                }
                            },
                            y: {
                                beginAtZero: true,
                                max: 5,
                                ticks: {
                                    callback: function(value) {
                                        const levels = ['', 'Spotting', 'Light', 'Medium', 'Heavy'];
                                        return levels[value];
                                    }
                                },
                                grid: {
                                    display: true,
                                }
                            },
                        },
                        elements: {
                            line: {
                                tension: 0.5,
                            },
                        },
                        layout: {
                            padding: {
                                top: 20,
                            },
                        },
                    }}
                    style={{width: '95vw', padding: '0.5em'}}
                />
            ) : (
                <p>Loading...</p>
            )}
        </View>
    );
};

export default SymptomChart;