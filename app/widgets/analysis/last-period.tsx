import React, { useState, useEffect } from 'react';
import { getLastPeriodStartDate } from './getLastPeriodStartDate';
import AnalysisWigi from './analysis-wigi';
import AsyncStorage from '@react-native-async-storage/async-storage';

// last period start date widget 
const LastPeriod = () => {
    const [lastPeriodStartDate, setLastPeriodStartDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userDataJSON = await AsyncStorage.getItem('allUsersData');
            const userData = userDataJSON ? JSON.parse(userDataJSON) : {};

            const currentUserJSON = await AsyncStorage.getItem('user');
            const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
            const username = currentUser?.username || 'Unknown User';

            const periodDates = Object.keys(userData[username] || {})
                .filter(date => userData[username][date].period)
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

            const lastPeriod = getLastPeriodStartDate(periodDates);
            setLastPeriodStartDate(lastPeriod);
        };

        fetchUserData();
    }, []);

    return (
        <AnalysisWigi 
            title="Last Period Start Date" 
            value={lastPeriodStartDate} 
            altMsg="No data yet" 
        />
    );
};

export default LastPeriod;
