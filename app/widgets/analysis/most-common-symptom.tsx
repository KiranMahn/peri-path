import React, { useState, useEffect, useContext } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalysisWigi from './analysis-wigi';
import { SettingsContext } from '../../settings-context'; // Import SettingsContext
const MostCommonSymptom: React.FC = () => {
    const [mostCommonSymptom, setMostCommonSymptom] = useState<string | null>(null);
    const settings = useContext(SettingsContext); // Access settings from context
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataJSON = await AsyncStorage.getItem('allUsersData');
                const userData = userDataJSON ? JSON.parse(userDataJSON) : {};

                const currentUserJSON = await AsyncStorage.getItem('user');
                const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
                const username = currentUser?.username || 'Unknown User';

                if (!userData[username]) return;

                const symptomCounts: Record<string, number> = {};

                Object.keys(userData[username]).forEach(date => {
                    const dayData = userData[username][date];
                    Object.keys(dayData).forEach(symptom => {
                        if (symptom !== 'period') {
                            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
                        }
                    });
                });

                const mostCommon = Object.keys(symptomCounts).reduce(
                    (a, b) => (symptomCounts[a] > symptomCounts[b] ? a : b),
                    ''
                );

                setMostCommonSymptom(mostCommon || null);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const formatSymptomName = (symptom: string): string => {
        return symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    return (
        <AnalysisWigi
            title="Most Common Symptom"
            value={mostCommonSymptom ? formatSymptomName(mostCommonSymptom) : 'No symptom data available'}
            altMsg="No symptom data available"
        />
    );
};

export default MostCommonSymptom;
