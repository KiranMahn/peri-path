import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalysisWigi from './analysis-wigi';

const getStartDates = (periodDates) => {
    let periodStartDates = [];
    for (let i = 1; i < periodDates.length; i++) {
        const prevDate = new Date(periodDates[i - 1]);
        const currentDate = new Date(periodDates[i]);
        const daysBetween = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

        if (daysBetween > 1) {
            periodStartDates.push(currentDate);
        }
    }
    periodStartDates.push(new Date(periodDates[0]));
    return periodStartDates.sort((a, b) => a - b);
};

const getEndDates = (periodDates) => {
    let periodEndDates = [];
    for (let i = 1; i < periodDates.length; i++) {
        const prevDate = new Date(periodDates[i - 1]);
        const currentDate = new Date(periodDates[i]);
        const daysBetween = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
        if (daysBetween > 1) {
            periodEndDates.push(prevDate);
        }
    }
    periodEndDates.push(new Date(periodDates[periodDates.length - 1]));
    return periodEndDates.sort((a, b) => a - b);
};

const getPeriodLength = (periodStartDates, periodEndDates) => {
    let totalDays = 0;
    for (let i = 1; i < periodStartDates.length; i++) {
        const endDate = periodEndDates[i - 1];
        const startDate = periodStartDates[i];
        const daysBetween = (startDate - endDate) / (1000 * 60 * 60 * 24);
        totalDays += daysBetween;
    }
    return totalDays / (periodStartDates.length - 1);
};

const CycleLength = () => {
    const [averageCycleLength, setAverageCycleLength] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUserData = await AsyncStorage.getItem('user');
                const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
                const username = currentUser ? currentUser.username : 'Unknown User';

                const allUsersData = await AsyncStorage.getItem('allUsersData');
                const usersData = allUsersData ? JSON.parse(allUsersData) : {};

                const userData = usersData[username] || {};

                const periodDates = Object.keys(userData)
                    .filter(date => userData[date].period)
                    .sort((a, b) => new Date(a) - new Date(b));

                if (periodDates.length < 2) {
                    setMessage('Not enough data to calculate cycle length.');
                    return;
                }

                const periodStartDates = getStartDates(periodDates);
                const periodEndDates = getEndDates(periodDates);

                if (periodEndDates.length < 2 || periodStartDates.length < 2) {
                    setMessage('Not enough data to calculate cycle length.');
                    return;
                }

                const average = getPeriodLength(periodStartDates, periodEndDates);
                setAverageCycleLength(Math.round(average));
            } catch (error) {
                console.error('Error fetching data from AsyncStorage:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <AnalysisWigi title="Average Cycle Length" value={averageCycleLength ? `${averageCycleLength} days` : ''} altMsg={message} />
    );
};

export default CycleLength;
