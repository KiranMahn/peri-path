import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalysisWigi from './analysis-wigi';

// average period length widget

const PeriodLength = () => {
    const [averagePeriodLength, setAveragePeriodLength] = useState(null);
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
                    setMessage('Not enough data to calculate period length.');
                    return;
                }

                let periodLengths = [];
                let currentPeriodLength = 1;

                for (let i = 1; i < periodDates.length; i++) {

                    const prevDate = new Date(periodDates[i - 1]);
                    const currentDate = new Date(periodDates[i]);
                    const daysBetween = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

                    if (daysBetween === 1) {
                        currentPeriodLength++;
                    } else {
                        periodLengths.push(currentPeriodLength);
                        currentPeriodLength = 1;
                    }

                }
                periodLengths.push(currentPeriodLength);

                const totalDays = periodLengths.reduce((acc, length) => acc + length, 0);
                const average = totalDays / periodLengths.length;

                setAveragePeriodLength(Math.round(average));
                
            } catch (error) {
                console.error('Error fetching data from AsyncStorage:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <AnalysisWigi title="Average Period Length" value={averagePeriodLength ? `${averagePeriodLength} days` : ''} message={message} />
    );
};

export default PeriodLength;
